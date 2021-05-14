import test from 'ava'
import cuid from 'cuid'
import { assert } from '../../../helpers/chai'
import { mock } from '../../../helpers/boleto'
import { setBoletoRulesConfiguration } from '../../../../src/lib/helpers/configurations'

test('setBoletoRulesConfiguration: issuer development', async (t) => {
  const payload = mock
  const operationId = cuid()

  payload.rules = null
  payload.issuer = 'development'

  const boleto = await setBoletoRulesConfiguration(payload, operationId)

  t.is(boleto.issuer_wallet, '26')
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

test('setBoletoRulesConfiguration: without rules', async (t) => {
  const payload = mock
  const operationId = cuid()

  payload.rules = null
  payload.issuer = 'boleto-api-bradesco-shopfacil'

  const boleto = await setBoletoRulesConfiguration(payload, operationId)

  t.is(boleto.issuer_wallet, '26')
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

test('setBoletoRulesConfiguration: no_strict', async (t) => {
  const payload = mock
  const operationId = cuid()

  payload.rules = ['no_strict']

  const boleto = await setBoletoRulesConfiguration(payload, operationId)

  t.is(boleto.issuer_wallet, '26')
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

test('setBoletoRulesConfiguration: strict_expiration_date', async (t) => {
  const payload = mock
  const operationId = cuid()

  payload.rules = ['strict_expiration_date']

  const boleto = await setBoletoRulesConfiguration(payload, operationId)

  t.is(boleto.issuer_wallet, '25')
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

test('setBoletoRulesConfiguration: caixa with no_strict rules', async (t) => {
  const payload = mock
  const operationId = cuid()

  payload.rules = ['no_strict']
  payload.issuer = 'boleto-api-caixa'


  const boleto = await setBoletoRulesConfiguration(payload, operationId)

  t.is(boleto.issuer_wallet, '26')
  t.is(boleto.issuer, 'boleto-api-caixa')

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

