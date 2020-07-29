const database = require('../../database')
const { buildSuccessResponse } = require('../../lib/http/response')
const { parse } = require('../../lib/http/request')
const { buildModelResponse } = require('./model')
const { handleError } = require('../../lib/helpers/errors')
const { createSchema, updateSchema } = require('./schema')
const { makeFromLogger } = require('../../lib/logger')
const { defaultCuidValue } = require('../../lib/database/schema')
const ConfigurationService = require('./service')

const { Configuration } = database.models
const makeLogger = makeFromLogger('configuration/index')

const create = async (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const logger = makeLogger({ operation: 'handle_configuration_request' }, { id: requestId })

  try {
    const parsedBody = await parse(createSchema, req.body)
    const configuration = await Configuration.create(parsedBody)
    const configResponse = await buildModelResponse(configuration)
    const response = await buildSuccessResponse(201)(configResponse)

    const { body, statusCode } = response

    logger.info({
      status: 'success',
      metadata: {
        body,
        statusCode,
      },
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
    const parsedBody = await parse(updateSchema)({ id, ...req.body })
    const configuration = await service.update(parsedBody)
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
