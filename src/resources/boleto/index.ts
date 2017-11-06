import * as Promise from 'bluebird'
import { both, complement, path, prop, propEq } from 'ramda'
import sqs from '../../lib/sqs'
import { buildSuccessResponse, buildFailureResponse } from '../../lib/http/response'
import { ValidationError, NotFoundError, InternalServerError } from '../../lib/errors'
import BoletoService from './service'
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
  const requestId = event.headers['x-request-id'] || defaultCuidValue('req_')()
  const service = BoletoService({ requestId })

  const body = JSON.parse(event.body || JSON.stringify({}))
  const logger = makeLogger({ operation: 'handle_boleto_request' }, { id: requestId })

  const shouldRegister = () => body.register !== 'false' && body.register !== false

  const registerBoletoConditionally = (boleto) => {
    if (shouldRegister()) {
      return service.register(boleto)
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
        sub_operation: 'send_to_background_queue', status: 'started',
        metadata: { boleto_id: boleto.id }
      })
      return BoletosToRegisterQueue.push({
        boleto_id: boleto.id
      })
        .then(() => {
          logger.info({
            sub_operation: 'send_to_background_queue', status: 'success',
            metadata: { boleto_id: boleto.id }
          })
        })
        .catch((err) => {
          logger.info({
            sub_operation: 'send_to_background_queue', status: 'failed',
            metadata: { err, boleto_id: boleto.id }
          })
          throw err
        })
    }
  }

  logger.info({ status: 'started', metadata: { body } })

  return Promise.resolve(body)
    .then(parse(createSchema))
    .then(service.create)
    .tap(registerBoletoConditionally)
    .tap(pushBoletoToQueueConditionally)
    .then(buildModelResponse)
    .then(buildSuccessResponse(201))
    .tap((response) => {
      logger.info({
        status: 'success',
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
  const requestId = defaultCuidValue('req_')()
  const service = BoletoService({ requestId })

  const logger = makeLogger({ operation: 'register' }, { id: requestId })
  const { boleto_id, sqsMessage } = event

  // eslint-disable-next-line
  const removeBoletoFromQueueConditionally = (boleto) => {
    if (boleto.status === 'registered' || boleto.status === 'refused') {
      logger.info({
        sub_operation: 'remove_from_background_queue', status: 'started',
        metadata: { boleto_id: boleto.id }
      })
      return BoletosToRegisterQueue.remove(sqsMessage)
        .then(() => {
          logger.info({
            sub_operation: 'remove_from_background_queue', status: 'success',
            metadata: { boleto_id: boleto.id }
          })
        })
        .catch((err) => {
          logger.info({
            sub_operation: 'remove_from_background_queue', status: 'failed',
            metadata: { err, boleto_id: boleto.id }
          })
          throw err
        })
    }
  }

  const sendMessageToUserQueueConditionally = (boleto) => {
    if (boleto.status === 'registered' || boleto.status === 'refused') {
      logger.info({
        sub_operation: 'send_message_to_client_queue',
        status: 'started',
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
            sub_operation: 'send_message_to_client_queue',
            status: 'success',
            metadata: { boleto_id: boleto.id }
          })
        })
        .catch((err) => {
          logger.info({
            sub_operation: 'send_message_to_client_queue',
            status: 'failed',
            metadata: { err, boleto_id: boleto.id }
          })
          throw err
        })
    }
  }

  logger.info({ status: 'started', metadata: event })

  return Promise.resolve(boleto_id)
    .then(service.registerById)
    .tap(removeBoletoFromQueueConditionally)
    .tap(sendMessageToUserQueueConditionally)
    .tap((response) => {
      logger.info({
        status: 'success',
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
  const requestId = event.headers['x-request-id'] || defaultCuidValue('req_')()
  const service = BoletoService({ requestId })

  const body = JSON.parse(event.body || JSON.stringify({}))
  const { bank_response_code, paid_amount } = body
  const id = path(['pathParameters', 'id'], event)

  return Promise.resolve({ id, bank_response_code, paid_amount })
    .then(parse(updateSchema))
    .then(service.update)
    .then(buildModelResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .then(response => callback(null, response))
}

export const index = (event, context, callback) => {
  configureContext(context)
  const requestId = event.headers['x-request-id'] || defaultCuidValue('req_')()
  const service = BoletoService({ requestId })

  const page = path(['queryStringParameters', 'page'], event)
  const count = path(['queryStringParameters', 'count'], event)

  // tslint:disable-next-line
  const title_id = path(['queryStringParameters', 'title_id'], event)
  const token = path(['queryStringParameters', 'token'], event)

  return Promise.resolve({ page, count, token, title_id })
    .then(parse(indexSchema))
    .then(service.index)
    .then(buildModelResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .then(response => callback(null, response))
}

export const show = (event, context, callback) => {
  configureContext(context)
  const requestId = event.headers['x-request-id'] || defaultCuidValue('req_')()
  const service = BoletoService({ requestId })

  const id = path(['pathParameters', 'id'], event)

  return Promise.resolve(id)
    .then(service.show)
    .then(buildModelResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .then(response => callback(null, response))
}

export const processBoletosToRegister = (event, context, callback) => {
  configureContext(context)
  const requestId = defaultCuidValue('req_')()
  const service = BoletoService({ requestId })

  const logger = makeLogger({ operation: 'process_background_queue' }, { id: requestId })

  logger.info({ status: 'started' })

  BoletosToRegisterQueue.startProcessing(service.processBoleto, {
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
