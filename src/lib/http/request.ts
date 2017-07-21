import { validate } from 'joi'
import { curryN } from 'ramda'
import { InvalidParameterError, ValidationError } from '../errors'

export const parse = curryN(2, (schema, data) => new Promise((resolve, reject) => {
  const options = {
    abortEarly: false
  }

  const { error, value } = validate(data, schema, options)

  if (!error) {
    return resolve(value)
  }

  const errors = error.details.map(err => new InvalidParameterError({
    field: err.path,
    message: err.message
  }))

  return reject(new ValidationError({ errors }))
}))
