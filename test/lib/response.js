import test from 'ava'
import { buildResponse } from '../../src/lib/response'

test('builds a response', async (t) => {
  const data = { message: 'not found' }
  const { statusCode, body } = buildResponse(404, data)

  t.is(statusCode, 404)
  t.is(body, JSON.stringify(data))
})

test('builds a response with no parameters', async (t) => {
  const { statusCode, body } = buildResponse()

  t.is(statusCode, 200)
  t.is(body, JSON.stringify({}))
})
