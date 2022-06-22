import test from 'ava'
import Joi from 'joi'
import { assert } from '../../../helpers/chai'
import { ValidationError } from '../../../../src/lib/errors'
import { parse, getRequestTimeoutMs } from '../../../../src/lib/http/request'

const schema = {
  name: Joi
    .string()
    .required(),

  security_number: Joi
    .number(),
}

test('parse: with valid schema', async (t) => {
  const value = await parse(schema, {
    name: 'David Bowie',
    security_number: 42,
  })

  t.deepEqual(value, {
    name: 'David Bowie',
    security_number: 42,
  }, 'should have the correct parsed parameters and no errors')
})

test('parse: with valid schema and coercion', async (t) => {
  const value = await parse(schema, {
    name: 'David Bowie',
    security_number: '42',
  })

  t.deepEqual(value, {
    name: 'David Bowie',
    security_number: 42,
  }, 'should have the correct parsed, coerced parameters and no errors')
})

test('parse: with valid schema and specific validate options allowUnknown true', async (t) => {
  const specificJoiValidateOptions = {
    allowUnknown: true,
  }

  const value = await parse(schema, {
    name: 'David Bowie',
    security_number: 42,
    a: 'a',
    b: 'b',
  }, specificJoiValidateOptions)

  t.deepEqual(value, {
    name: 'David Bowie',
    security_number: 42,
    a: 'a',
    b: 'b',
  }, 'should have the correct parsed parameters and no errors')
})

test('parse: with valid schema and specific validate options allowUnknown false', async (t) => {
  const specificJoiValidateOptions = {
    allowUnknown: false,
  }

  const validationError = await parse(schema, {
    name: 'David Bowie',
    security_number: 42,
    a: 'a',
    b: 'b',
  }, specificJoiValidateOptions).catch(err => err)

  const { errors } = validationError

  t.true(validationError instanceof ValidationError, 'should be a ValidationError')
  t.true(Array.isArray(errors), 'should have an array of errors')
  t.is(errors.length, 2, 'should have 2 errors')

  assert.containSubset(errors[0], {
    message: '"a" is not allowed',
    type: 'invalid_parameter',
    field: 'a',
  }, 'should have an error because `a` is anknown')

  assert.containSubset(errors[1], {
    message: '"b" is not allowed',
    type: 'invalid_parameter',
    field: 'b',
  }, 'should have an error because `b` is anknown')
})

test('parse: with invalid schema', async (t) => {
  const validationError = await parse(schema, {
    security_number: true,
  }).catch(err => err)

  const { errors } = validationError

  t.true(validationError instanceof ValidationError, 'should be a ValidationError')
  t.true(Array.isArray(errors), 'should have an array of errors')
  t.is(errors.length, 2, 'should have 2 errors')

  assert.containSubset(errors[0], {
    message: '"name" is required',
    type: 'invalid_parameter',
    field: 'name',
  }, 'should have an error because `name` is invalid')

  assert.containSubset(errors[1], {
    message: '"security_number" must be a number',
    type: 'invalid_parameter',
    field: 'security_number',
  }, 'should have an error because `security_number` is invalid')
})

test('getRequestTimeoutMs: when environment test timeout is set', async (t) => {
  const timeoutMs = getRequestTimeoutMs(null, 50000)

  t.is(timeoutMs, 50000)
})

test('getRequestTimeoutMs: when environment test timeout is not set', async (t) => {
  const timeoutMs = getRequestTimeoutMs()

  t.is(timeoutMs, 25000)
})
