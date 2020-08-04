import cuid from 'cuid'
import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { createConfig } from '../../helpers/configuration'
import configurationHandler from '../../../src/resources/configuration'
import database from '../../../src/database'

const { Configuration } = database.models
const showConfig = normalizeHandler(configurationHandler.show)
const externalId = cuid()

test.afterEach(async () => {
  await Configuration.destroy({
    where: {
      external_id: externalId,
    },
  })
})

test('shows an existing configuration', async (t) => {
  const configuration = await createConfig({
    external_id: externalId,
    issuer: 'bradesco',
  })

  const { body, statusCode } = await showConfig({
    params: {
      external_id: externalId,
    },
  })

  t.is(statusCode, 200)
  t.is(body.external_id, externalId)
  t.is(body.object, 'configuration')

  assert.containSubset(body, {
    external_id: externalId,
    issuer: 'bradesco',
    issuer_account: configuration.issuer_account,
    issuer_agency: configuration.issuer_agency,
    issuer_wallet: configuration.issuer_wallet,
  })
})

test('shows a non-existing configuration', async (t) => {
  const { body, statusCode } = await showConfig({
    params: {
      external_id: 'xxxxx',
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
