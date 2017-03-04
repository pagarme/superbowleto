import test from 'ava'
import { models } from '../../../../src/database'
import { handleDatabaseErrors } from '../../../../src/resources/errors/database'
import { ValidationError, InvalidParameterError } from '../../../../src/resources/errors'

const { Queue } = models

test('handleDatabaseErrors: ValidationError', async (t) => {
  const err = await Queue.create({})
    .catch(handleDatabaseErrors)

  const errors = err.errors

  t.true(err instanceof ValidationError, 'is a ValidationError')
  t.true(Array.isArray(errors), 'has an array of errors')
  t.true(errors[0] instanceof InvalidParameterError, 'has an InvalidParameterError')
  t.is(errors[0].message, 'url cannot be null', 'has an error with a message')
  t.is(errors[0].field, 'url', 'has an error with `field = url`')
  t.is(errors[0].type, 'invalid_parameter', 'has an error with `type = invalid_parameter`')
})
