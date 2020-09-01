import test from 'ava'
import cuid from 'cuid'
import { merge } from 'ramda'
import { assert } from '../../helpers/chai'
import { mock } from '../../helpers/configuration'
import request from '../../helpers/request'
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

test('POST /configurations', async (t) => {
  const configuration = merge(mock, {
    issuer: 'bradesco',
    external_id: externalId,
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

  assert.containSubset(body, {
    external_id: externalId,
    issuer: 'bradesco',
    issuer_account: mock.issuer_account,
    issuer_agency: mock.issuer_agency,
    issuer_wallet: mock.issuer_wallet,
  })
})

test('POST /configurations with invalid parameters', async (t) => {
  const wrongIssuer = merge(mock, {
    issuer: 'bradesco-typo',
    external_id: true,
    name: 'abc',
  })

  const { body, statusCode } = await request({
    route: '/configurations',
    method: 'POST',
    data: wrongIssuer,
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 400)

  t.deepEqual(body, {
    errors: [
      {
        type: 'invalid_parameter',
        message: '"external_id" must be a string',
        field: 'external_id',
      },
      {
        type: 'invalid_parameter',
        message: '"issuer" must be one of [bradesco, boleto-api-bradesco-shopfacil, boleto-api-caixa, development]',
        field: 'issuer',
      },
      {
        type: 'invalid_parameter',
        message: '"name" is not allowed',
        field: 'name',
      },
    ],
  })
})
