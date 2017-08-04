import * as Promise from 'bluebird'
import { both, complement, path, prop, propEq } from 'ramda'
import sqs from '../../lib/sqs'
import { buildSuccessResponse, buildFailureResponse } from '../../lib/http/response'
import { ValidationError, NotFoundError, InternalServerError } from '../../lib/errors'
import * as boletoService from './service'
import { parse } from '../../lib/http/request'
import { createSchema, updateSchema, indexSchema } from './schema'
import { makeFromLogger } from '../../lib/logger'
import { BoletosToRegisterQueue, BoletosToRegisterQueueUrl } from './queues'
import lambda from './lambda'
import { defaultCuidValue, responseObjectBuilder } from '../../lib/database/schema'
import { buildModelResponse } from './model'

const makeLogger = makeFromLogger('boleto/index')

const handleError = (err) => {
  if (err instanceof ValidationError) {
    return buildFailureResponse(400, err)
  }

  if (err instanceof NotFoundError) {
    return buildFailureResponse(404, err)
  }

  return buildFailureResponse(500, new InternalServerError())
}

const configureContext = (context: any = {}) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false
}

export const create = (event, context, callback) => {
  configureContext(context)

  const body = JSON.parse(event.body || JSON.stringify({}))
  const logger = makeLogger({ operation: 'create' }, { id: defaultCuidValue('req_')() })

  const shouldRegister = () => body.register !== 'false' && body.register !== false

  const registerBoletoConditionally = (boleto) => {
    if (shouldRegister()) {
      return boletoService.register(boleto)
    }

    return boleto
  }

  // eslint-disable-next-line
  const pushBoletoToQueueConditionally = (boleto) => {
    const propNotEq = complement(propEq)
    const shouldSendBoletoToQueue = both(
      propEq('status', 'pending_registration'),
      propNotEq('issuer', 'development')
    )

    if (shouldSendBoletoToQueue(boleto)) {
      logger.info({
        subOperation: 'pushToQueue', status: 'started',
        metadata: { boleto_id: boleto.id }
      })
      return BoletosToRegisterQueue.push({
        boleto_id: boleto.id
      })
        .then(() => {
          logger.info({
            subOperation: 'pushToQueue', status: 'succeeded',
            metadata: { boleto_id: boleto.id }
          })
        })
        .catch((err) => {
          logger.info({
            subOperation: 'pushToQueue', status: 'failed',
            metadata: { err, boleto_id: boleto.id }
          })
          throw err
        })
    }
  }

  logger.info({ status: 'started', metadata: { body } })

  return Promise.resolve(body)
    .then(parse(createSchema))
    .then(boletoService.create)
    .tap(registerBoletoConditionally)
    .tap(pushBoletoToQueueConditionally)
    .then(buildModelResponse)
    .then(buildSuccessResponse(201))
    .tap((response) => {
      logger.info({
        status: 'succeeded',
        metadata: { body: response.body, statusCode: response.statusCode }
      })
    })
    .catch((err) => {
      logger.error({ status: 'failed', metadata: { err } })
      return handleError(err)
    })
    .then(response => callback(null, response))
}

export const register = (event, context, callback) => {
  configureContext(context)

  const logger = makeLogger({ operation: 'register' }, { id: defaultCuidValue('req_')() })
  const { boleto_id, sqsMessage } = event

  // eslint-disable-next-line
  const removeBoletoFromQueueConditionally = (boleto) => {
    if (boleto.status === 'registered' || boleto.status === 'refused') {
      logger.info({
        subOperation: 'removeFromQueue', status: 'started',
        metadata: { boleto_id: boleto.id }
      })
      return BoletosToRegisterQueue.remove(sqsMessage)
        .then(() => {
          logger.info({
            subOperation: 'removeFromQueue', status: 'succeeded',
            metadata: { boleto_id: boleto.id }
          })
        })
        .catch((err) => {
          logger.info({
            subOperation: 'removeFromQueue', status: 'failed',
            metadata: { err, boleto_id: boleto.id }
          })
          throw err
        })
    }
  }

  const sendMessageToUserQueueConditionally = (boleto) => {
    if (boleto.status === 'registered' || boleto.status === 'refused') {
      logger.info({
        subOperation: 'sendToUserQueue', status: 'started',
        metadata: { boleto_id: boleto.id }
      })

      const params = {
        MessageBody: JSON.stringify({
          boleto_id: boleto.id,
          status: boleto.status,
          reference_id: boleto.reference_id
        }),
        QueueUrl: boleto.queue_url
      }

      return sqs.sendMessage(params).promise()
        .then(() => {
          logger.info({
            subOperation: 'sendToUserQueue', status: 'succeeded',
            metadata: { boleto_id: boleto.id }
          })
        })
        .catch((err) => {
          logger.info({
            subOperation: 'sendToUserQueue', status: 'failed',
            metadata: { err, boleto_id: boleto.id }
          })
          throw err
        })
    }
  }

  logger.info({ status: 'started', metadata: event })

  return Promise.resolve(boleto_id)
    .then(boletoService.registerById)
    .tap(removeBoletoFromQueueConditionally)
    .tap(sendMessageToUserQueueConditionally)
    .tap((response) => {
      logger.info({
        status: 'succeeded',
        metadata: { body: response.body, statusCode: response.statusCode }
      })
    })
    .catch((err) => {
      logger.error({ status: 'failed', metadata: { err } })
      callback(err)
    })
    .then(boleto => callback(null, boleto))
}

export const update = (event, context, callback) => {
  configureContext(context)

  const body = JSON.parse(event.body || JSON.stringify({}))
  const { bank_response_code, paid_amount } = body
  const id = path(['pathParameters', 'id'], event)

  return Promise.resolve({ id, bank_response_code, paid_amount })
    .then(parse(updateSchema))
    .then(boletoService.update)
    .then(buildModelResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .then(response => callback(null, response))
}

export const index = (event, context, callback) => {
  configureContext(context)

  const page = path(['queryStringParameters', 'page'], event)
  const count = path(['queryStringParameters', 'count'], event)

  // tslint:disable-next-line
  const title_id = path(['queryStringParameters', 'title_id'], event)
  const token = path(['queryStringParameters', 'token'], event)

  return Promise.resolve({ page, count, token, title_id })
    .then(parse(indexSchema))
    .then(boletoService.index)
    .then(buildModelResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .then(response => callback(null, response))
}

export const show = (event, context, callback) => {
  configureContext(context)

  const id = path(['pathParameters', 'id'], event)

  return Promise.resolve(id)
    .then(boletoService.show)
    .then(buildModelResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .then(response => callback(null, response))
}

export const processBoletosToRegister = (event, context, callback) => {
  configureContext(context)

  const logger = makeLogger(
    { operation: 'processBoletosToRegister' },{ id: defaultCuidValue('req_')() }
  )

  logger.info({ operation: 'processBoletosToRegister', status: 'started' })

  const processBoleto = (item, sqsMessage) => {
    lambda.register({
      sqsMessage,
      boleto_id: item.boleto_id
    })
  }

  BoletosToRegisterQueue.startProcessing(processBoleto, {
    keepMessages: true
  })

  function stopQueueWhenIdle () {
    const params = {
      QueueUrl: BoletosToRegisterQueueUrl,
      AttributeNames: ['ApproximateNumberOfMessages']
    }

    sqs.getQueueAttributes(params, (err, data) => {
      if (err) {
        return
      }

      const { ApproximateNumberOfMessages } = data.Attributes

      if (Number(ApproximateNumberOfMessages) < 1) {
        BoletosToRegisterQueue.stopProcessing()
        clearInterval(interval)
        callback(null)
      }
    })
  }

  const interval = setInterval(stopQueueWhenIdle, 5000)

  BoletosToRegisterQueue.on('error', (err) => {
    logger.error({ status: 'failed', metadata: { err } })
  })
}
