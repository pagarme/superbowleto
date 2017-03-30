import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { queueMock } from './helpers'
import * as queueHandler from '../../../src/resources/queue'

const createQueue = normalizeHandler(queueHandler.create)

test('creates a queue with valid data', async (t) => {
  const { body, statusCode } = await createQueue({
    body: queueMock
  })

  t.is(statusCode, 201)
  t.is(body.object, 'queue')
  assert.containSubset(body, queueMock)
})

test('creates a queue with invalid data', async (t) => {
  const { body, statusCode } = await createQueue({
    body: {
      name: 123
    }
  })

  t.is(statusCode, 400)
  assert.containSubset(body, {
    errors: [{
      type: 'invalid_parameter',
      field: 'url',
      message: '"url" is required'
    }, {
      type: 'invalid_parameter',
      field: 'name',
      message: '"name" must be a string'
    }]
  })
})
