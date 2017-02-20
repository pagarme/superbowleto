import { curryN, compose, objOf } from 'ramda'
import { normalizeError } from '../resources/errors/normalizer'

export const buildErrorPayload = compose(
  objOf('errors'),
  normalizeError
)

export const buildSuccessResponse = curryN(2, (statusCode, data) => ({
  statusCode,
  body: JSON.stringify(data)
}))

export const buildFailureResponse = curryN(2, (statusCode, data) => ({
  statusCode,
  body: JSON.stringify(buildErrorPayload(data))
}))
