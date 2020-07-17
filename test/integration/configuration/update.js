import cuid from 'cuid'
import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { createConfig } from '../../helpers/configuration'
import configurationHandler from '../../../src/resources/configuration'
import database from '../../../src/database'

const { Configuration } = database.models
const updateConfig = normalizeHandler(configurationHandler.update)

test.after(async () => {
  await Configuration.destroy({ where: {} })
})

test('Update configuration: issuer and issuer_agency', async (t) => {
  const companyId = cuid()

  const configuration = await createConfig({
    external_id: companyId,
    issuer: 'bradesco',
  })

  const { statusCode, body } = await updateConfig({
    params: {
      id: configuration.id,
    },
    body: {
      issuer: 'boleto-api-bradesco-shopfacil',
      issuer_agency: '5555',
    },
  })

  t.is(statusCode, 200)
  t.is(body.object, 'configuration')

  assert.containSubset(body, {
    external_id: companyId,
    issuer: 'boleto-api-bradesco-shopfacil',
    issuer_account: configuration.issuer_account,
    issuer_agency: '5555',
    issuer_wallet: configuration.issuer_wallet,
  }, 'result must have the shape of a configuration')
})

test('Update configuration with invalid issuer', async (t) => {
  const companyId = cuid()
  const configuration = await createConfig({
    external_id: companyId,
    issuer: 'bradesco',
  })

  const { statusCode, body } = await updateConfig({
    params: {
      id: configuration.id,
    },
    body: {
      issuer: 'shopfacil',
    },
  })

  t.is(statusCode, 400)

  assert.containSubset(body, {
    errors: [{
      type: 'invalid_parameter',
      message: '"issuer" must be one of [bradesco, boleto-api-bradesco-shopfacil, development]',
      field: 'issuer',
    }],
  })
})
