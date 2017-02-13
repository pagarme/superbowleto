import test from 'ava'
import { assert } from '../../test-utils/chai'
import { normalizeHandler } from '../../test-utils/normalizer'
import { queueMock } from './test-utils'
import * as queueHandler from '../../../src/resources/queue/handler'

const createQueue = normalizeHandler(queueHandler.create)

test('creates a queue', async (t) => {
  const { body, statusCode } = await createQueue({
    body: queueMock
  })

  t.is(statusCode, 201)
  assert.containSubset(body, queueMock)
})
