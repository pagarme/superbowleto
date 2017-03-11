import { curryN } from 'ramda'
import { validate } from 'joi'
import { ValidationError, InvalidParameterError } from '../errors'

export const parse = curryN(2, (schema, data) => new Promise((resolve, reject) => {
  const options = {
    abortEarly: false
  }

  const { error, value } = validate(data, schema, options)

  if (!error) {
    return resolve(value)
  }

  const errors = error.details.map(err => new InvalidParameterError({
    message: err.message,
    field: err.path
  }))

  return reject(new ValidationError({ errors }))
}))
