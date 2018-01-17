import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { createBoleto } from '../../helpers/boleto'
import boletoHandler from '../../../src/resources/boleto'

const updateBoleto = normalizeHandler(boletoHandler.update)

// eslint-disable-next-line
test(`Update boleto's paid_amount and bank_response_code`, async (t) => {
  const boleto = await createBoleto()

  const { statusCode, body } = await updateBoleto({
    params: {
      id: boleto.id,
    },
    body: {
      paid_amount: 300,
      bank_response_code: 'brc_973927',
    },
  })

  t.is(statusCode, 200)
  t.is(body.object, 'boleto')
  assert.containSubset(body, {
    status: 'issued',
    paid_amount: 300,
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'bradesco',
    issuer_id: null,
    payer_name: 'David Bowie',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872',
    company_name: 'Some Company',
    company_document_number: '98154524872',
    bank_response_code: 'brc_973927',
  }, 'result must have the shape of a boleto')
})

// eslint-disable-next-line
test(`Update boleto's paid_amount`, async (t) => {
  const boleto = await createBoleto()

  const { statusCode, body } = await updateBoleto({
    params: {
      id: boleto.id,
    },
    body: {
      paid_amount: 300,
    },
  })

  t.is(statusCode, 200)
  t.is(body.object, 'boleto')
  assert.containSubset(body, {
    status: 'issued',
    paid_amount: 300,
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'bradesco',
    issuer_id: null,
    payer_name: 'David Bowie',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872',
    company_name: 'Some Company',
    company_document_number: '98154524872',
    bank_response_code: null,
  }, 'result must have the shape of a boleto')
})
