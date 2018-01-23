import test from 'ava'
import { is } from 'ramda'
import request from '../../helpers/request'

test('GET /boletos with authentication', async (t) => {
  const { body, statusCode } = await request({
    route: '/boletos',
    method: 'GET',
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 200)
  t.true(is(Array, body))
})

test('GET /boletos with invalid authentication', async (t) => {
  const { body, statusCode } = await request({
    route: '/boletos',
    method: 'GET',
    headers: {
      'x-api-key': 'INVALID_KEY',
    },
  })

  t.is(statusCode, 401)
  t.deepEqual(body, {
    errors: [
      {
        field: null,
        message: 'Unauthorized',
        type: 'authorization',
      },
    ],
  })
})

test('GET /boletos without authentication', async (t) => {
  const { body, statusCode } = await request({
    route: '/boletos',
    method: 'GET',
  })

  t.is(statusCode, 401)
  t.deepEqual(body, {
    errors: [
      {
        field: null,
        message: 'Unauthorized',
        type: 'authorization',
      },
    ],
  })
})

