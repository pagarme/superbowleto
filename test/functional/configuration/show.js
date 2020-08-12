import test from 'ava'
import cuid from 'cuid'
import { merge } from 'ramda'
import { assert } from '../../helpers/chai'
import request from '../../helpers/request'
import { mock } from '../../helpers/configuration'
import database from '../../../src/database'

const { Configuration } = database.models
const externalId = cuid()

test.afterEach(async () => {
  await Configuration.destroy({
    where: {
      external_id: externalId,
    },
  })
})

test('GET /configurations/:id with valid id', async (t) => {
  const configuration = merge(mock, {
    issuer: 'bradesco',
    external_id: externalId,
  })

  await request({
    route: '/configurations',
    method: 'POST',
    data: configuration,
    headers: {
      'x-api-key': 'abc123',
    },
  })

  const { body, statusCode } = await request({
    route: `/configurations/${externalId}`,
    method: 'GET',
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 200)
  t.is(body.external_id, externalId)
  t.is(body.object, 'configuration')

  assert.containSubset(body, {
    external_id: externalId,
    issuer: 'bradesco',
    issuer_account: mock.issuer_account,
    issuer_agency: mock.issuer_agency,
    issuer_wallet: mock.issuer_wallet,
  }, 'result must have the shape of a configuration')
})

test('GET /configurations/:id with invalid id', async (t) => {
  const INVALID_ID = 'INVALID_ID'

  const { body, statusCode } = await request({
    route: `/configurations/${INVALID_ID}`,
    method: 'GET',
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 404)

  t.deepEqual(body, {
    errors: [
      {
        type: 'not_found',
        message: 'Configuration not found',
        field: null,
      },
    ],
  })
})
