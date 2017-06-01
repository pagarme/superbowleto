import test from 'ava'
import Joi from 'joi'
import { assert } from '../../../helpers/chai'
import { ValidationError } from '../../../../build/lib/errors'
import { parse } from '../../../../build/lib/http/request'

const schema = {
  name: Joi
    .string()
    .required(),

  security_number: Joi
    .number()
}

test('parse: with valid schema', async (t) => {
  const value = await parse(schema, {
    name: 'David Bowie',
    security_number: 42
  })

  t.deepEqual(value, {
    name: 'David Bowie',
    security_number: 42
  }, 'should have the correct parsed parameters and no errors')
})

test('parse: with valid schema and coercion', async (t) => {
  const value = await parse(schema, {
    name: 'David Bowie',
    security_number: '42'
  })

  t.deepEqual(value, {
    name: 'David Bowie',
    security_number: 42
  }, 'should have the correct parsed, coerced parameters and no errors')
})

test('parse: with invalid schema', async (t) => {
  const validationError = await parse(schema, {
    security_number: true
  }).catch(err => err)

  const { errors } = validationError

  t.true(validationError instanceof ValidationError, 'should be a ValidationError')
  t.true(Array.isArray(errors), 'should have an array of errors')
  t.is(errors.length, 2, 'should have 2 errors')

  assert.containSubset(errors[0], {
    message: '"name" is required',
    type: 'invalid_parameter',
    field: 'name'
  }, 'should have an error because `name` is invalid')

  assert.containSubset(errors[1], {
    message: '"security_number" must be a number',
    type: 'invalid_parameter',
    field: 'security_number'
  }, 'should have an error because `security_number` is invalid')
})
