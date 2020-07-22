const Promise = require('bluebird')
const {
  both,
  complement,
  propEq,
} = require('ramda')
const { buildSuccessResponse } = require('../../lib/http/response')
const {
  MethodNotAllowedError,
} = require('../../lib/errors')
const { handleError } = require('../../lib/helpers/errors')
const BoletoService = require('./service')
const { parse } = require('../../lib/http/request')
const { createSchema, updateSchema, indexSchema } = require('./schema')
const { makeFromLogger } = require('../../lib/logger')
const { BoletosToRegisterQueue } = require('./queues')
const { defaultCuidValue } = require('../../lib/database/schema')
const { buildModelResponse } = require('./model')

const makeLogger = makeFromLogger('boleto/index')

const create = (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const service = BoletoService({ operationId: requestId })

  const logger = makeLogger({ operation: 'handle_boleto_request' }, { id: requestId })

  const shouldRegister = () => req.body.register !== 'false' && req.body.register !== false

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
        sub_operation: 'send_to_background_queue',
        status: 'started',
        metadata: { boleto_id: boleto.id },
      })
      return BoletosToRegisterQueue.push({
        boleto_id: boleto.id,
      })
        .then(() => {
          logger.info({
            sub_operation: 'send_to_background_queue',
            status: 'success',
            metadata: { boleto_id: boleto.id },
          })
        })
        .catch((err) => {
          logger.info({
            sub_operation: 'send_to_background_queue',
            status: 'failed',
            metadata: {
              error_name: err.name,
              error_stack: err.stack,
              error_message: err.message,
            },
          })
          throw err
        })
    }
  }

  logger.info({ status: 'started', metadata: { body: req.body } })

  return Promise.resolve(req.body)
    .then(parse(createSchema))
    .then(service.create)
    .tap(registerBoletoConditionally)
    .tap(pushBoletoToQueueConditionally)
    .then(buildModelResponse)
    .then(buildSuccessResponse(201))
    .tap((response) => {
      logger.info({
        status: 'success',
        metadata: { body: response.body, statusCode: response.statusCode },
      })
    })
    .catch((err) => {
      logger.error({
        status: 'failed',
        metadata: {
          error_name: err.name,
          error_stack: err.stack,
          error_message: err.message,
        },
      })
      return handleError(err)
    })
    .tap(({ body, statusCode }) => res.status(statusCode).send(body))
}

const update = (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const service = BoletoService({ operationId: requestId })

  const { params: { id } } = req

  return Promise.resolve({ id, ...req.body })
    .then(parse(updateSchema))
    .then(service.update)
    .then(buildModelResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .tap(({ body, statusCode }) => res.status(statusCode).send(body))
}

const index = (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const service = BoletoService({ operationId: requestId })

  const { query } = req

  return Promise.resolve(query)
    .then(parse(indexSchema))
    .then(service.index)
    .then(buildModelResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .tap(({ body, statusCode }) => res.status(statusCode).send(body))
}

const show = (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const service = BoletoService({ operationId: requestId })

  const { params: { id } } = req

  return Promise.resolve(id)
    .then(service.show)
    .then(buildModelResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .tap(({ body, statusCode }) => res.status(statusCode).send(body))
}

const defaultHandler = (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const logger = makeLogger({ operation: 'handle_default_boleto_request' }, { id: requestId })

  return Promise.reject(new MethodNotAllowedError({
    message: `${req.method} method is not allowed for boleto resource`,
  }))
    .catch((err) => {
      logger.error({
        status: 'failed',
        metadata: {
          error_name: err.name,
          error_stack: err.stack,
          error_message: err.message,
        },
      })
      return handleError(err)
    })
    .tap(({ body, statusCode }) => res.status(statusCode).send(body))
}

module.exports = {
  create,
  update,
  index,
  show,
  defaultHandler,
}
