import test from 'ava'
import cuid from 'cuid'
import { merge } from 'ramda'
import { mock } from '../../helpers/configuration'
import request from '../../helpers/request'

test('POST /configurations with authentication', async (t) => {
  const companyId = cuid()

  const configuration = merge(mock, {
    issuer: 'bradesco',
    external_id: companyId,
  })

  const { body, statusCode } = await request({
    route: '/configurations',
    method: 'POST',
    data: configuration,
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 201)
  t.is(body.object, 'configuration')
})

test('POST /configurations with invalid authentication', async (t) => {
  const companyId = cuid()

  const configuration = merge(mock, {
    issuer: 'bradesco',
    external_id: companyId,
  })

  const { body, statusCode } = await request({
    route: '/configurations',
    method: 'POST',
    data: configuration,
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

test('POST /configurations without authentication', async (t) => {
  const companyId = cuid()

  const configuration = merge(mock, {
    issuer: 'bradesco',
    external_id: companyId,
  })

  const { body, statusCode } = await request({
    route: '/configurations',
    method: 'POST',
    data: configuration,
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
