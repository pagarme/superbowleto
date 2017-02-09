import test from 'ava'
import { assert } from '../../utils/chai'
import { normalizeHandler } from '../../utils/normalizer'
import * as queue from '../../../src/resources/queue/handler'

const create = normalizeHandler(queue.create)

test('creates a queue', async (t) => {
  const data = {
    body: {
      name: 'test-queue',
      url: 'http://yopa/queue/test'
    }
  }

  const { body, statusCode } = await create(data, {})

  t.is(statusCode, 201)

  assert.containSubset(body, {
    name: 'test-queue',
    url: 'http://yopa/queue/test'
  })
})
