import cuid from 'cuid'
import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { mock } from '../../helpers/configuration/index'
import configHandler from '../../../src/resources/configuration'
import database from '../../../src/database'

const { Configuration } = database.models
const create = normalizeHandler(configHandler.create)
const externalId = cuid()

test.afterEach(async () => {
  await Configuration.destroy({
    where: {
      external_id: externalId,
    },
  })
})

test('creates a configuration', async (t) => {
  const payload = mock

  payload.external_id = externalId
  payload.issuer = 'bradesco'

  const { body, statusCode } = await create({
    body: payload,
  })

  t.is(statusCode, 201)
  t.is(body.object, 'configuration')

  assert.containSubset(body, {
    external_id: payload.external_id,
    issuer: payload.issuer,
    issuer_account: payload.issuer_account,
    issuer_agency: payload.issuer_agency,
    issuer_wallet: payload.issuer_wallet,
  })
})

test('creates a configuration with invalid data', async (t) => {
  const payload = mock

  payload.external_id = null
  payload.issuer = 'shopfacil'

  const { body, statusCode } = await create({
    body: payload,
  })

  t.is(statusCode, 400)

  assert.containSubset(body, {
    errors: [{
      type: 'invalid_parameter',
      message: '"external_id" must be a string',
      field: 'external_id',
    }, {
      type: 'invalid_parameter',
      message: '"issuer" must be one of [bradesco, boleto-api-bradesco-shopfacil, boleto-api-caixa, development]',
      field: 'issuer',
    }],
  })
})
