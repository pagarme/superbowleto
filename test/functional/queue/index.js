import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { mock, createQueue } from './helpers'
import * as queueHandler from '../../../src/resources/queue'

const indexQueue = normalizeHandler(queueHandler.index)

test.before(async () => {
  await Promise.all([...Array(15)].map(createQueue))
})

test('shows all queues with default pagination', async (t) => {
  const { body, statusCode } = await indexQueue()
  const item = body[0]

  t.is(statusCode, 200)
  t.is(body.length, 10, 'should have the default 10 items on the result')
  t.is(item.object, 'queue')
  assert.containSubset(item, mock)
})

test('shows all queues with custom pagination', async (t) => {
  const { body, statusCode } = await indexQueue({
    queryStringParameters: {
      count: 2
    }
  })
  const item = body[0]

  t.is(statusCode, 200)
  t.is(body.length, 2, 'should have 2 items on the result')
  t.is(item.object, 'queue')
  assert.containSubset(item, mock)
})
