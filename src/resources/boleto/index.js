const Promise = require('bluebird')
const {
  both,
  complement,
  propEq,
} = require('ramda')
const sqs = require('../../lib/sqs')
const { buildSuccessResponse, buildFailureResponse } = require('../../lib/http/response')
const { ValidationError, NotFoundError, InternalServerError } = require('../../lib/errors')
const BoletoService = require('./service')
const { parse } = require('../../lib/http/request')
const { createSchema, updateSchema, indexSchema } = require('./schema')
const { makeFromLogger } = require('../../lib/logger')
const { BoletosToRegisterQueue, BoletosToRegisterQueueUrl } = require('./queues')
const { defaultCuidValue } = require('../../lib/database/schema')
const { buildModelResponse } = require('./model')

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

const configureContext = (context = {}) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false
}

const create = (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const service = BoletoService({ requestId })

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

const register = (event, context, callback) => {
  configureContext(context)
  const requestId = defaultCuidValue('req_')()
  const service = BoletoService({ requestId })

  const logger = makeLogger({ operation: 'register' }, { id: requestId })
  const { boleto_id, sqsMessage } = event // eslint-disable-line

  // eslint-disable-next-line
  const removeBoletoFromQueueConditionally = (boleto) => {
    if (boleto.status === 'registered' || boleto.status === 'refused') {
      logger.info({
        sub_operation: 'remove_from_background_queue',
        status: 'started',
        metadata: { boleto_id: boleto.id },
      })
      return BoletosToRegisterQueue.remove(sqsMessage)
        .then(() => {
          logger.info({
            sub_operation: 'remove_from_background_queue',
            status: 'success',
            metadata: { boleto_id: boleto.id },
          })
        })
        .catch((err) => {
          logger.info({
            sub_operation: 'remove_from_background_queue',
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

  const sendMessageToUserQueueConditionally = (boleto) => { // eslint-disable-line
    if (boleto.status === 'registered' || boleto.status === 'refused') {
      logger.info({
        sub_operation: 'send_message_to_client_queue',
        status: 'started',
        metadata: { boleto_id: boleto.id },
      })

      const params = {
        MessageBody: JSON.stringify({
          boleto_id: boleto.id,
          status: boleto.status,
          reference_id: boleto.reference_id,
        }),
        QueueUrl: boleto.queue_url,
      }

      return sqs.sendMessage(params).promise()
        .then(() => {
          logger.info({
            sub_operation: 'send_message_to_client_queue',
            status: 'success',
            metadata: { boleto_id: boleto.id },
          })
        })
        .catch((err) => {
          logger.info({
            sub_operation: 'send_message_to_client_queue',
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

  logger.info({ status: 'started', metadata: event })

  return Promise.resolve(boleto_id)
    .then(service.registerById)
    .tap(removeBoletoFromQueueConditionally)
    .tap(sendMessageToUserQueueConditionally)
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
      callback(err)
    })
    .then(boleto => callback(null, boleto))
}

const update = (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const service = BoletoService({ requestId })

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
  const service = BoletoService({ requestId })

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
  const service = BoletoService({ requestId })

  const { params: { id } } = req

  return Promise.resolve(id)
    .then(service.show)
    .then(buildModelResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .tap(({ body, statusCode }) => res.status(statusCode).send(body))
}

const processBoletosToRegister = (event, context, callback) => {
  configureContext(context)
  const requestId = defaultCuidValue('req_')()
  const service = BoletoService({ requestId })

  const logger = makeLogger({ operation: 'process_background_queue' }, { id: requestId })

  logger.info({ status: 'started' })

  BoletosToRegisterQueue.startProcessing(service.processBoleto, {
    keepMessages: true,
  })

  function stopQueueWhenIdle () {
    const params = {
      QueueUrl: BoletosToRegisterQueueUrl,
      AttributeNames: ['ApproximateNumberOfMessages'],
    }

    sqs.getQueueAttributes(params, (err, data) => {
      if (err) {
        return
      }

      const { ApproximateNumberOfMessages } = data.Attributes

      if (Number(ApproximateNumberOfMessages) < 1) {
        BoletosToRegisterQueue.stopProcessing()
        clearInterval(interval) // eslint-disable-line
        callback(null)
      }
    })
  }

  const interval = setInterval(stopQueueWhenIdle, 5000)

  BoletosToRegisterQueue.on('error', (err) => {
    logger.error({
      status: 'failed',
      metadata: {
        error_name: err.name,
        error_stack: err.stack,
        error_message: err.message,
      },
    })
  })
}

module.exports = {
  create,
  register,
  update,
  index,
  show,
  processBoletosToRegister,
}
