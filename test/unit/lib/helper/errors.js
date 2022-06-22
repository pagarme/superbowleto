import test from 'ava'
import {
  isA4XXError, isTimeoutError,
} from '../../../../src/lib/helpers/errors'

test('isA4xxError: is not a 4xx error', async (t) => {
  const error = {
    response: {
      status: 500,
    },
  }

  const result = isA4XXError(error)

  t.is(result, false)
})

test('isA4xxError: is not a 4xx error', async (t) => {
  const error = {
    response: {
      status: 399,
    },
  }

  const result = isA4XXError(error)

  t.is(result, false)
})

test('isA4xxError: is a 4xx error', async (t) => {
  const error = {
    response: {
      status: 400,
    },
  }

  const result = isA4XXError(error)

  t.is(result, true)
})

test('isA4xxError: is a 4xx error', async (t) => {
  const error = {
    response: {
      status: 499,
    },
  }

  const result = isA4XXError(error)

  t.is(result, true)
})

test('isTimeoutError: is a axios timeout error', async (t) => {
  const error = {
    code: 'ECONNABORTED',
  }

  const result = isTimeoutError(error)

  t.is(result, true)
})

test('isTimeoutError: is not a axios timeout error', async (t) => {
  const error = {
    code: 'IsNotAAxiosTimeoutError',
  }

  const result = isTimeoutError(error)

  t.is(result, false)
})
