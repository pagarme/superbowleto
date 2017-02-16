import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { queueMock } from './helpers'
import * as queueHandler from '../../../src/resources/queue/handler'

const createQueue = normalizeHandler(queueHandler.create)

test('creates a queue', async (t) => {
  const { body, statusCode } = await createQueue({
    body: queueMock
  })

  t.is(statusCode, 201)
  assert.containSubset(body, queueMock)
})
