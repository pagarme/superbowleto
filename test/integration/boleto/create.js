import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import boletoHandler from '../../../src/resources/boleto'
import { userQueueUrl } from '../../helpers/boleto'

const create = normalizeHandler(boletoHandler.create)

test('creates a boleto with invalid data', async (t) => {
  const payload = {
    expiration_date: true,
    issuer: 100,
    payer_document_type: 'xxx',
    rules: 123,
  }

  const { body, statusCode } = await create({
    body: payload,
  })

  t.is(statusCode, 400)
  assert.containSubset(body, {
    errors: [{
      type: 'invalid_parameter',
      message: '"queue_url" is required',
      field: 'queue_url',
    }, {
      type: 'invalid_parameter',
      message: '"expiration_date" must be a number of milliseconds or valid date string',
      field: 'expiration_date',
    }, {
      type: 'invalid_parameter',
      message: '"amount" is required',
      field: 'amount',
    }, {
      type: 'invalid_parameter',
      message: '"issuer" must be a string',
      field: 'issuer',
    }, {
      type: 'invalid_parameter',
      message: '"payer_name" is required',
      field: 'payer_name',
    }, {
      type: 'invalid_parameter',
      message: '"payer_document_type" must be one of [cpf, cnpj]',
      field: 'payer_document_type',
    }, {
      type: 'invalid_parameter',
      message: '"payer_document_number" is required',
      field: 'payer_document_number',
    }, {
      type: 'invalid_parameter',
      message: '"rules" must be an array',
      field: 'rules',
    }],
  })
})

test('creates a non-registrable boleto', async (t) => {
  const payload = {
    expiration_date: new Date(),
    amount: 2000,
    issuer: 'bradesco',
    issuer_account: '9721',
    issuer_agency: '3381',
    issuer_wallet: '26',
    instructions: 'Please do not accept after expiration_date',
    register: false,
    queue_url: userQueueUrl,
    title_id: 123456,
    token: 'live_az1sx2dc3fv4gb5gb6hn7',
    company_name: 'Some Company',
    company_document_number: '98154524872',
    reference_id: 'ref_niidkanfikenafi',
  }

  const { body, statusCode } = await create({
    body: payload,
  })

  t.is(statusCode, 201)
  t.is(body.object, 'boleto')
  t.true(body.title_id != null)
  t.true(body.token != null)
  t.true(body.reference_id != null)
  t.true(typeof body.title_id === 'number')
  t.true(typeof body.token === 'string')
  t.true(typeof body.reference_id === 'string')
  assert.containSubset(body, {
    status: 'issued',
    paid_amount: 0,
    amount: payload.amount,
    token: 'live_az1sx2dc3fv4gb5gb6hn7',
    instructions: payload.instructions,
    issuer: payload.issuer,
    issuer_id: null,
    title_id: 123456,
    payer_name: null,
    payer_document_type: null,
    payer_document_number: null,
    queue_url: payload.queue_url,
    company_name: payload.company_name,
    company_document_number: payload.company_document_number,
  })
})
