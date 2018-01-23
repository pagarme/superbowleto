const Promise = require('bluebird')
const { equals } = require('ramda')
const { getCredentials } = require('../lib/credentials')
const { buildFailureResponse } = require('../lib/http/response')
const { AuthorizationError } = require('../lib/errors')
const { defaultCuidValue } = require('../lib/database/schema')
const { makeFromLogger } = require('../lib/logger')

const makeLogger = makeFromLogger('middleware/authorization')

const isAuthorized = (result) => {
  if (!result) {
    return Promise.reject(new AuthorizationError({
      message: 'Unauthorized',
    }))
  }

  return Promise.resolve()
}

const authentication = (req, res, next) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const logger = makeLogger(
    { operation: 'handle_authentication' },
    { id: requestId }
  )
  const apiKey = req.get('x-api-key')

  return Promise.all([
    getCredentials('accounts/pagarme/api_key'),
    Promise.resolve(apiKey),
  ])
    .spread(equals)
    .then(isAuthorized)
    .then(next)
    .catch((err) => {
      logger.error({
        status: 'failed',
        metadata: {
          error_name: err.name,
          error_stack: err.stack,
          error_message: err.message,
        },
      })
      return Promise.reject(buildFailureResponse(401, err))
    })
    .catch(({ body, statusCode }) => res.status(statusCode).send(body))
}

module.exports = {
  authentication,
  isAuthorized,
}
