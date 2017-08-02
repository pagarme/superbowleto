import { compose, curryN, objOf } from 'ramda'
import { normalizeErrors } from '../errors/normalizer'

export const buildErrorPayload = compose(
  objOf('errors'),
  normalizeErrors
)

export const buildSuccessResponse = curryN(2, (statusCode, data) => ({
  statusCode,
  body: JSON.stringify(data)
}))

export const buildFailureResponse = curryN(2, (statusCode, data) => ({
  statusCode,
  body: JSON.stringify(buildErrorPayload(data))
}))
