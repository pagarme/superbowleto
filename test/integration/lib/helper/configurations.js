import test from 'ava'
import cuid from 'cuid'
import { assert } from '../../../helpers/chai'
import { mock } from '../../../helpers/boleto'
import { findBoletoConfiguration } from '../../../../src/lib/helpers/configurations'
import { createConfig } from '../../../helpers/configuration'
import database from '../../../../src/database'

const { Configuration } = database.models
const externalId = cuid()

test.afterEach(async () => {
  await Configuration.destroy({
    where: {
      external_id: externalId,
    },
  })
})

test('findBoletoConfiguration: without configuration created', async (t) => {
  const payload = mock
  const operationId = cuid()

  payload.external_id = externalId
  payload.issuer = 'boleto-api-bradesco-shopfacil'

  const boleto = await findBoletoConfiguration(payload, operationId)

  t.is(boleto.issuer, 'bradesco')

  assert.containSubset(boleto, {
    issuer: boleto.issuer,
    issuer_account: boleto.issuer_account,
    issuer_agency: boleto.issuer_agency,
    issuer_wallet: boleto.issuer_wallet,
    amount: payload.amount,
    instructions: payload.instructions,
    payer_name: payload.payer_name,
    company_name: payload.company_name,
  })
})

test('findBoletoConfiguration: without externalId', async (t) => {
  const payload = mock
  const operationId = cuid()

  payload.external_id = undefined
  payload.issuer = 'boleto-api-bradesco-shopfacil'

  const boleto = await findBoletoConfiguration(payload, operationId)

  t.is(boleto.issuer, 'bradesco')

  assert.containSubset(boleto, {
    issuer: boleto.issuer,
    issuer_account: boleto.issuer_account,
    issuer_agency: boleto.issuer_agency,
    issuer_wallet: boleto.issuer_wallet,
    amount: payload.amount,
    instructions: payload.instructions,
    payer_name: payload.payer_name,
    company_name: payload.company_name,
  })
})

test('findBoletoConfiguration: with configuration created', async (t) => {
  await createConfig({
    issuer: 'boleto-api-bradesco-shopfacil',
    external_id: externalId,
  })

  const payload = mock
  const operationId = cuid()

  payload.external_id = externalId

  const boleto = await findBoletoConfiguration(payload, operationId)

  t.is(boleto.issuer, 'boleto-api-bradesco-shopfacil')

  assert.containSubset(boleto, {
    issuer: boleto.issuer,
    issuer_account: boleto.issuer_account,
    issuer_agency: boleto.issuer_agency,
    issuer_wallet: boleto.issuer_wallet,
    amount: payload.amount,
    instructions: payload.instructions,
    payer_name: payload.payer_name,
    company_name: payload.company_name,
  })
})
