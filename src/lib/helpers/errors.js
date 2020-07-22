const {
  path,
} = require('ramda')
const { buildFailureResponse } = require('../http/response')
const {
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
  InternalServerError,
} = require('../errors')

function isA4XXError (error) {
  return (path(['response', 'status'], error) >= 400 &&
  path(['response', 'status'], error) < 500)
}

function handleError (err) {
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

module.exports = {
  isA4XXError,
  handleError,
}
