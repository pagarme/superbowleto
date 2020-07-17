import cuid from 'cuid'
import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import configHandler from '../../../src/resources/configuration'
import database from '../../../src/database'

const { Configuration } = database.models
const create = normalizeHandler(configHandler.create)

test.after(async () => {
  await Configuration.destroy({ where: {} })
})

test('creates a configuration', async (t) => {
  const companyId = cuid()

  const payload = {
    external_id: companyId,
    issuer: 'bradesco',
    issuer_account: '9721',
    issuer_agency: '3381',
    issuer_wallet: '26',
  }

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
  const payload = {
    external_id: null,
    issuer: 'shopfacil',
    issuer_account: '123',
    issuer_agency: '3381',
    issuer_wallet: '26',
  }

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
      message: '"issuer" must be one of [bradesco, boleto-api-bradesco-shopfacil, development]',
      field: 'issuer',
    }],
  })
})
