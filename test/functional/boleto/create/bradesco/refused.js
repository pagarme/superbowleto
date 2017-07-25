import test from 'ava'
import Promise from 'bluebird'
import { assert } from '../../../../helpers/chai'
import { normalizeHandler } from '../../../../helpers/normalizer'
import { mock, mockFunction, restoreFunction } from '../../../../helpers/boleto'
import * as boletoHandler from '../../../../../build/resources/boleto'
import * as provider from '../../../../../build/providers/bradesco'

const create = normalizeHandler(boletoHandler.create)

test.before(() => {
  mockFunction(provider, 'register', () => Promise.resolve({ status: 'refused' }))
})

test.after(async () => {
  restoreFunction(provider, 'register')
})

test('creates a boleto (provider refused)', async (t) => {
  const payload = mock

  const { body, statusCode } = await create({
    body: payload
  })

  t.is(statusCode, 201)
  t.is(body.object, 'boleto')

  t.true(body.title_id != null)
  t.true(body.barcode != null)
  t.true(typeof body.title_id === 'number')

  assert.containSubset(body, {
    status: 'refused',
    paid_amount: 0,
    amount: payload.amount,
    instructions: payload.instructions,
    issuer: payload.issuer,
    issuer_id: null,
    payer_name: payload.payer_name,
    payer_document_type: payload.payer_document_type,
    payer_document_number: payload.payer_document_number,
    company_name: payload.company_name,
    company_document_number: payload.company_document_number,
    queue_url: payload.queue_url
  })
})
