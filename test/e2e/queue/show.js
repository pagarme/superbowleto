import test from 'ava'
import { assert } from '../../test-utils/chai'
import { normalizeHandler } from '../../test-utils/normalizer'
import { queueMock, createQueue } from './test-utils'
import * as queueHandler from '../../../src/resources/queue/handler'

const showQueue = normalizeHandler(queueHandler.show)

test('shows an existing queue', async (t) => {
  const queue = await createQueue()

  const { body, statusCode } = await showQueue({
    pathParameters: {
      id: queue.id
    }
  })

  t.is(statusCode, 200)
  t.is(body.id, queue.id)
  assert.containSubset(body, queueMock)
})

test('shows a non-existing queue', async (t) => {
  const { statusCode } = await showQueue({
    pathParameters: {
      id: 'queue_xxx'
    }
  })

  t.is(statusCode, 404)
})
