import * as Promise from 'bluebird'
import { path } from 'ramda'
import sqs from '../../lib/sqs'
import { buildSuccessResponse, buildFailureResponse } from '../../lib/http/response'
import { ValidationError, NotFoundError, InternalServerError } from '../../lib/errors'
import * as boletoService from './service'
import { parse } from '../../lib/http/request'
import { createSchema, updateSchema } from './schema'
import { makeFromLogger } from '../../lib/logger'
import { defaultCuidValue } from '../../lib/database/schema'
import { BoletosToRegisterQueue } from './queues'
import { models } from '../../database'

const { Boleto } = models

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

export const create = (event, context, callback) => {
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
    if (boleto.status === 'pending_registration') {
      logger.info({ subOperation: 'pushToQueue', status: 'started', metadata: { boleto_id: boleto.id } })
      return BoletosToRegisterQueue.push({
        boleto_id: boleto.id
      })
        .then(() => {
          logger.info({ subOperation: 'pushToQueue', status: 'succeeded', metadata: { boleto_id: boleto.id } })
        })
        .catch((err) => {
          logger.info({ subOperation: 'pushToQueue', status: 'failed', metadata: { boleto_id: boleto.id, err } })
          throw err
        })
    }
  }

  logger.info({ status: 'started', metadata: { body } })

  Promise.resolve(body)
    .then(parse(createSchema))
    .then(boletoService.create)
    .tap(registerBoletoConditionally)
    .tap(pushBoletoToQueueConditionally)
    .then(Boleto.buildResponse)
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
  const body = JSON.parse(event.body || JSON.stringify({}))
  const logger = makeLogger({ operation: 'register' }, { id: defaultCuidValue('req_')() })
  const { boleto_id, sqsMessage } = body

  // eslint-disable-next-line
  const removeBoletoFromQueueConditionally = (boleto) => {
    if (boleto.status === 'registered' || boleto.status === 'refused') {
      logger.info({ subOperation: 'removeFromQueue', status: 'started', metadata: { boleto_id: boleto.id } })
      return BoletosToRegisterQueue.remove(sqsMessage)
        .then(() => {
          logger.info({ subOperation: 'removeFromQueue', status: 'succeeded', metadata: { boleto_id: boleto.id } })
        })
        .catch((err) => {
          logger.info({ subOperation: 'removeFromQueue', status: 'failed', metadata: { boleto_id: boleto.id, err } })
          throw err
        })
    }
  }

  // eslint-disable-next-line
  const sendMessageToUserQueueConditionally = (boleto) => {
    if (boleto.status === 'registered' || boleto.status === 'refused') {
      logger.info({ subOperation: 'sendToUserQueue', status: 'started', metadata: { boleto_id: boleto.id } })

      const params = {
        MessageBody: JSON.stringify({
          boleto_id: boleto.id,
          status: boleto.status
        }),
        QueueUrl: boleto.queue_url
      }

      return sqs.sendMessage(params).promise()
        .then(() => {
          logger.info({ subOperation: 'sendToUserQueue', status: 'succeeded', metadata: { boleto_id: boleto.id } })
        })
        .catch((err) => {
          logger.info({ subOperation: 'sendToUserQueue', status: 'failed', metadata: { boleto_id: boleto.id, err } })
          throw err
        })
    }
  }

  logger.info({ status: 'started', metadata: { body } })

  boletoService.registerById(boleto_id)
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
  const body = JSON.parse(event.body || JSON.stringify({}))
  const { bank_response_code, paid_amount } = body
  const id = path(['pathParameters', 'id'], event)

  Promise.resolve({ id, bank_response_code, paid_amount })
    .then(parse(updateSchema))
    .then(boletoService.update)
    .then(Boleto.buildResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .then(response => callback(null, response))
}

export const index = (event, context, callback) => {
  const page = path(['queryStringParameters', 'page'], event)
  const count = path(['queryStringParameters', 'count'], event)

  Promise.resolve({ page, count })
    .then(boletoService.index)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .then(response => callback(null, response))
}

export const show = (event, context, callback) => {
  const id = path(['pathParameters', 'id'], event)

  Promise.resolve(id)
    .then(boletoService.show)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .then(response => callback(null, response))
}

export const processBoletosToRegister = (event, context, callback) => {
  Promise.resolve(boletoService.processBoletosToRegister)
    .then(() => callback(null))
    .catch(err => callback(err))
}
