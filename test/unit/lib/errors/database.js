import test from 'ava'
import Sequelize from 'sequelize'
import { identity } from 'ramda'
import { handleDatabaseErrors } from '../../../../src/lib/errors/database'
import {
  DatabaseError,
  InvalidParameterError,
  ValidationError,
} from '../../../../src/lib/errors'
import database from '../../../../src/database'

const { Boleto } = database.models

test('handleDatabaseErrors: ValidationError', async (t) => {
  const err = await Boleto.create({})
    .catch(handleDatabaseErrors)
    .catch(identity)

  const { errors } = err

  t.true(err instanceof ValidationError, 'is a ValidationError')
  t.true(Array.isArray(errors), 'has an array of errors')
  t.true(errors[0] instanceof InvalidParameterError, 'has an InvalidParameterError')
  t.is(errors[0].message, 'queue_url cannot be null', 'has an error with a `message` property')
  t.is(errors[0].field, 'queue_url', 'has an error with `field = queue_url`')
  t.is(errors[0].type, 'invalid_parameter', 'has an error with `type = invalid_parameter`')
})

test('handleDatabaseErrors: DatabaseError', async (t) => {
  const err = await Promise.resolve()
    .then(() => {
      throw new Sequelize.Error('id should be unique')
    })
    .catch(handleDatabaseErrors)
    .catch(identity)

  t.true(err instanceof DatabaseError, 'is a DatabaseError')
  t.false(err instanceof Sequelize.Error, 'is not a SequelizeError')
  t.is(err.message, 'id should be unique', 'has a `message` property')
  t.is(err.type, 'database', 'has a `type` property')
})
