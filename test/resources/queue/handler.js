import test from 'ava'
import { promisify } from 'bluebird'
import { assert } from '../../utils/chai'
import * as queue from '../../../src/resources/queue/handler'

const create = promisify(queue.create)

test('creates a queue', async (t) => {
  const data = {
    body: JSON.stringify({
      name: 'test-queue',
      url: 'http://yopa/queue/test'
    })
  }

  const { body, statusCode } = await create(data, {})
  const parsedBody = JSON.parse(body)

  t.is(statusCode, 201)

  assert.containSubset(parsedBody, {
    name: 'test-queue',
    url: 'http://yopa/queue/test'
  })
})
