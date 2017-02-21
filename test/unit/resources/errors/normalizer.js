import test from 'ava'
import { NotFoundError } from '../../../../src/resources/errors'
import { normalizeErrors } from '../../../../src/resources/errors/normalizer'

test('normalizeErrors: with one single error', async (t) => {
  const errors = normalizeErrors(new NotFoundError({
    message: 'Resource not found',
    field: 'resource'
  }))

  t.true(Array.isArray(errors), 'should be an array')
  t.is(errors.length, 1, 'should have 1 item on the array')

  t.is(errors[0].type, 'not_found', 'should have a `type` property')
  t.is(errors[0].field, 'resource', 'should have a `field` property')
  t.is(errors[0].message, 'Resource not found', 'should have a `message` property')
})

test('normalizeErrors: with multiple errors', async (t) => {
  const errors = normalizeErrors({
    errors: [
      new Error(),
      new NotFoundError({ message: 'Resource not found', field: 'resource' })
    ]
  })

  t.true(Array.isArray(errors), 'should be an array')
  t.is(errors.length, 2, 'should have 2 items on the array')

  t.is(errors[0].type, 'unknown_error', 'should have a `type` property')
  t.is(errors[0].field, null, 'should have a `field` property')
  t.is(errors[0].message, '', 'should have a `message` property')

  t.is(errors[1].type, 'not_found', 'should have a `type` property')
  t.is(errors[1].field, 'resource', 'should have a `resource` property')
  t.is(errors[1].message, 'Resource not found', 'should have a `message` property')
})
