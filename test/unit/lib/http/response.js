import test from 'ava'
import {
  buildSuccessResponse,
  buildFailureResponse,
  buildErrorPayload,
} from '../../../../src/lib/http/response'

test('buildSuccessResponse', async (t) => {
  const input = { message: 'This is some useful message' }
  const { body, statusCode } = buildSuccessResponse(200, input)

  t.is(statusCode, 200, 'should have the correct `statusCode`')
  t.is(body, input, 'should have the correct `body`')
})

test('buildFailureResponse', async (t) => {
  const error = new Error()
  const errorPayload = buildErrorPayload(error)
  const { body, statusCode } = buildFailureResponse(400, error)

  t.is(statusCode, 400, 'should have the correct `statusCode`')
  t.deepEqual(
    body,
    errorPayload,
    'should have the `error` payload as the `body`'
  )
})

test('buildErrorPayload', async (t) => {
  const errorPayload = buildErrorPayload(new Error())

  t.deepEqual(errorPayload, {
    errors: [{
      type: 'unknown_error',
      message: '',
      field: null,
    }],
  }, 'should have an `errors` object')
})
