import test from 'ava'
import { promisify } from 'bluebird'
import * as queue from '../../src/handlers/queue'

const create = promisify(queue.create)

test('creates a queue', async (t) => {
  const { statusCode, body } = await create({}, {})

  t.is(statusCode, 201)
  t.is(typeof body, 'string')
  t.notThrows(() => JSON.parse(body), 'should be a valid JSON string')
})
