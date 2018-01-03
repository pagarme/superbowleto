import test from 'ava'
import { InvalidParameterError } from '../../../../src/lib/errors'
import { normalizeErrors } from '../../../../src/lib/errors/normalizer'

test('normalizeErrors: with one single error', async (t) => {
  const errors = normalizeErrors(new InvalidParameterError({
    message: 'Resource not found',
    field: 'resource',
  }))

  t.true(Array.isArray(errors), 'is an array')
  t.is(errors.length, 1, 'has 1 item on the array')

  t.is(errors[0].type, 'invalid_parameter', 'has a `type` property')
  t.is(errors[0].field, 'resource', 'has a `field` property')
  t.is(errors[0].message, 'Resource not found', 'has a `message` property')
})

test('normalizeErrors: with multiple errors', async (t) => {
  const errors = normalizeErrors({
    errors: [
      new Error(),
      new InvalidParameterError({ message: 'Resource not found', field: 'resource' }),
    ],
  })

  t.true(Array.isArray(errors), 'is an array')
  t.is(errors.length, 2, 'has 2 items on the array')

  t.is(errors[0].type, 'unknown_error', 'has a `type` property')
  t.is(errors[0].field, null, 'has a `field` property')
  t.is(errors[0].message, '', 'has a `message` property')

  t.is(errors[1].type, 'invalid_parameter', 'has a `type` property')
  t.is(errors[1].field, 'resource', 'has a `resource` property')
  t.is(errors[1].message, 'Resource not found', 'has a `message` property')
})
