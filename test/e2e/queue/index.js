import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { queueMock, createQueue } from './helpers'
import * as queueHandler from '../../../src/resources/queue/handler'

const indexQueue = normalizeHandler(queueHandler.index)

test.before(async () => {
  await Promise.all([...Array(15)].map(createQueue))
})

test('shows all queues with default pagination', async (t) => {
  const { body, statusCode } = await indexQueue()
  const resultSample = body[0]

  t.is(statusCode, 200)
  t.is(body.length, 10, 'should have the default 10 items on the result')
  assert.containSubset(resultSample, queueMock, 'result must have the shape of a queue')
})

test('shows all queues with custom pagination', async (t) => {
  const { body, statusCode } = await indexQueue({
    queryStringParameters: {
      count: 2
    }
  })
  const resultSample = body[0]

  t.is(statusCode, 200)
  t.is(body.length, 2, 'should have 2 items on the result')
  assert.containSubset(resultSample, queueMock, 'result must have the shape of a queue')
})
