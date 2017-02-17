import test from 'ava'
import { buildResponse, buildErrorPayload } from '../../../src/lib/response'

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

test('builds an error payload', async (t) => {
  const error = buildErrorPayload(new Error())

  t.deepEqual(error, {
    errors: [{
      type: 'unknown_error',
      message: '',
      field: null
    }]
  }, 'should have an `errors` property')
})
