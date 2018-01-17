const Promise = require('bluebird')
const { buildFailureResponse } = require('../lib/http/response')
const { NotFoundError, InternalServerError } = require('../lib/errors')
const { defaultCuidValue } = require('../lib/database/schema')
const { makeFromLogger } = require('../lib/logger')

const makeLogger = makeFromLogger('default/index')

const handleError = (err) => {
  if (err instanceof NotFoundError) {
    return buildFailureResponse(404, err)
  }

  return buildFailureResponse(500, new InternalServerError())
}

const defaultResourceHandler = (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const logger = makeLogger({ operation: 'handle_default' }, { id: requestId })

  return Promise.reject(new NotFoundError({
    message: `${req.path} resource not found`,
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
  defaultResourceHandler,
}
