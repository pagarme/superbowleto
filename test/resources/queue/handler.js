import test from 'ava'
import { assert } from '../../utils/chai'
import { normalizeHandler } from '../../utils/normalizer'
import { models } from '../../../src/database'
import * as queue from '../../../src/resources/queue/handler'

const create = normalizeHandler(queue.create)
const show = normalizeHandler(queue.show)

const queueMock = {
  name: 'test-queue',
  url: 'http://yopa/queue/test'
}

test('creates a queue', async (t) => {
  const { body, statusCode } = await create({
    body: queueMock
  })

  t.is(statusCode, 201)

  assert.containSubset(body, {
    name: 'test-queue',
    url: 'http://yopa/queue/test'
  })
})

test('shows a queue', async (t) => {
  const createdQueue = (await models.queue.create(queueMock)).dataValues

  const { body, statusCode } = await show({
    pathParameters: {
      id: createdQueue.id
    }
  })

  t.is(statusCode, 200)

  assert.containSubset(body, {
    id: createdQueue.id,
    name: 'test-queue',
    url: 'http://yopa/queue/test'
  })
})

test('tries to find a queue that does not exist', async (t) => {
  const { statusCode } = await show({
    pathParameters: {
      id: 'queue_xxx'
    }
  })

  t.is(statusCode, 404)
})
