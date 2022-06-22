const { curryN } = require('ramda')
const Joi = require('joi')
const { ValidationError, InvalidParameterError } = require('../errors')

const parse = curryN(2, (
  schema,
  data,
  specificOptions = {}
) => new Promise((resolve, reject) => {
  const options = {
    abortEarly: false,
    ...specificOptions,
  }

  const { error, value } = Joi.validate(data, schema, options)

  if (!error) {
    return resolve(value)
  }

  const errors = error.details.map(err => new InvalidParameterError({
    message: err.message,
    field: err.path.reduce((acc, curr) => `${acc}.${curr}`),
  }))

  return reject(new ValidationError({ errors }))
}))

const getRequestTimeoutMs = (timeoutMs = 10000, timeoutEnvTest = 25000) => (
  process.env.APP_ENV === 'prd' ? timeoutMs : timeoutEnvTest
)

module.exports = {
  parse,
  getRequestTimeoutMs,
}
