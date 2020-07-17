import cuid from 'cuid'
import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { createConfig } from '../../helpers/configuration'
import configurationHandler from '../../../src/resources/configuration'
import database from '../../../src/database'

const { Configuration } = database.models
const showConfig = normalizeHandler(configurationHandler.show)

test.after(async () => {
  await Configuration.destroy({ where: {} })
})

test('shows an existing configuration', async (t) => {
  const companyId = cuid()
  const configuration = await createConfig({
    external_id: companyId,
    issuer: 'bradesco',
  })

  const { body, statusCode } = await showConfig({
    params: {
      external_id: companyId,
    },
  })

  t.is(statusCode, 200)
  t.is(body.external_id, companyId)
  t.is(body.object, 'configuration')
  assert.containSubset(body, {
    external_id: companyId,
    issuer: 'bradesco',
    issuer_account: configuration.issuer_account,
    issuer_agency: configuration.issuer_agency,
    issuer_wallet: configuration.issuer_wallet,
  })
})

test('shows a non-existing configuration', async (t) => {
  const { statusCode } = await showConfig({
    params: {
      external_id: 'xxxxx',
    },
  })

  t.is(statusCode, 404)
})
