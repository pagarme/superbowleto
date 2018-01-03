import test from 'ava'
import {
  NotFoundError,
  InvalidParameterError,
  ValidationError,
  DatabaseError,
  InternalServerError,
} from '../../../../src/lib/errors'

test('NotFoundError', async (t) => {
  const error = new NotFoundError({
    message: 'User not found',
  })

  t.is(error.name, 'NotFoundError', 'has a `name` property')
  t.is(error.type, 'not_found', 'has a `type` property')
  t.is(error.message, 'User not found', 'has a `message` property')
  t.true(error instanceof NotFoundError, 'in an instance of an NotFoundError')
})

test('InvalidParameterError', async (t) => {
  const error = new InvalidParameterError({
    message: 'Resource not found',
    field: 'resource',
  })

  t.is(error.name, 'InvalidParameterError', 'has a `name` property')
  t.is(error.type, 'invalid_parameter', 'has a `type` property')
  t.is(error.field, 'resource', 'has a `field` property')
  t.is(error.message, 'Resource not found', 'has a `message` property')
  t.true(error instanceof InvalidParameterError, 'in an instance of an InvalidParameterError')
})

test('ValidationError', async (t) => {
  const error = new ValidationError({
    message: 'Object is not valid',
    errors: [
      new InvalidParameterError({
        message: 'User not found',
        field: 'user',
      }),
      new InvalidParameterError({
        message: 'Resource not found',
        field: 'resource',
      }),
    ],
  })

  const cases = [{
    message: 'User not found',
    field: 'user',
  }, {
    message: 'Resource not found',
    field: 'resource',
  }]

  t.is(error.name, 'ValidationError', 'has a `name` property')
  t.is(error.type, 'validation', 'has a `type` property')
  t.is(error.message, 'Object is not valid', 'has a `message` property')
  error.errors.forEach((errorItem, i) => {
    t.is(errorItem.name, 'InvalidParameterError', 'has a `name` property')
    t.is(errorItem.type, 'invalid_parameter', 'has a `type` property')
    t.is(errorItem.field, cases[i].field, 'has a `field` property')
    t.is(errorItem.message, cases[i].message, 'has a `message` property')
    t.true(errorItem instanceof InvalidParameterError, 'in an instance of an InvalidParameterError')
  })
  t.true(error instanceof ValidationError, 'in an instance of an ValidationError')
})

test('DatabaseError', async (t) => {
  const error = new DatabaseError({
    message: 'Database is not online, or credentials are wrong',
  })

  t.is(error.name, 'DatabaseError', 'has a `name` property')
  t.is(error.type, 'database', 'has a `type` property')
  t.is(error.message, 'Database is not online, or credentials are wrong', 'has a `message` property')
  t.true(error instanceof DatabaseError, 'in an instance of an DatabaseError')
})

test('InternalServerError', async (t) => {
  const error = new InternalServerError()

  t.is(error.name, 'InternalServerError', 'has a `name` property')
  t.is(error.type, 'internal', 'has a `type` property')
  t.is(error.message, '', 'has a `message` property')
  t.true(error instanceof InternalServerError, 'in an instance of an InternalServerError')
})
