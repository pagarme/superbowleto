import { compose, objOf } from 'ramda'
import { normalizeError } from '../resources/errors/normalizer'

export const buildResponse = (statusCode = 200, data = {}) => ({
  statusCode,
  body: JSON.stringify(data)
})

export const buildErrorPayload = compose(
  objOf('errors'),
  normalizeError
)
