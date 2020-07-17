const database = require('../../database')
const {
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
  InternalServerError,
} = require('../../lib/errors')
const { buildSuccessResponse, buildFailureResponse } = require('../../lib/http/response')
const { parse } = require('../../lib/http/request')
const { buildModelResponse } = require('./model')
const { createSchema, updateSchema } = require('./schema')
const { makeFromLogger } = require('../../lib/logger')
const { defaultCuidValue } = require('../../lib/database/schema')
const ConfigurationService = require('./service')

const { Configuration } = database.models
const makeLogger = makeFromLogger('configuration/index')

const handleError = (err) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return buildFailureResponse(400, err)
  }

  if (err instanceof ValidationError) {
    return buildFailureResponse(400, err)
  }

  if (err instanceof NotFoundError) {
    return buildFailureResponse(404, err)
  }

  if (err instanceof MethodNotAllowedError) {
    return buildFailureResponse(405, err)
  }

  return buildFailureResponse(500, new InternalServerError())
}

const create = async (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const logger = makeLogger({ operation: 'handle_configuration_request' }, { id: requestId })

  try {
    await parse(createSchema, req.body)
    const configuration = await Configuration.create(req.body)
    const configResponse = await buildModelResponse(configuration)
    const response = await buildSuccessResponse(201)(configResponse)
    const { body, statusCode } = response

    logger.info({
      status: 'success',
      metadata: { body, statusCode },
    })

    return res.status(statusCode).send(body)
  } catch (err) {
    logger.error({
      status: 'failed',
      metadata: {
        error_name: err.name,
        error_stack: err.stack,
        error_message: err.message,
      },
    })
    const { body, statusCode } = handleError(err)

    return res.status(statusCode).send(body)
  }
}

const update = async (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const service = ConfigurationService({ operationId: requestId })

  const { params: { id } } = req

  try {
    const parses = await parse(updateSchema)({ id, ...req.body })
    const configuration = await service.update(parses)
    const configResponse = await buildModelResponse(configuration)
    const response = await buildSuccessResponse(200)(configResponse)
    const { body, statusCode } = response

    return res.status(statusCode).send(body)
  } catch (err) {
    const { body, statusCode } = handleError(err)

    return res.status(statusCode).send(body)
  }
}

const show = async (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const service = ConfigurationService({ operationId: requestId })

  const { params: { external_id: externalId } } = req

  try {
    const configuration = await service.show(externalId)
    const configResponse = await buildModelResponse(configuration)
    const response = await buildSuccessResponse(200)(configResponse)
    const { body, statusCode } = response

    return res.status(statusCode).send(body)
  } catch (err) {
    const { body, statusCode } = handleError(err)

    return res.status(statusCode).send(body)
  }
}

module.exports = {
  create,
  update,
  show,
}
