import test from 'ava'
import { assert } from '../../helpers/chai'
import { mock } from '../../helpers/boleto'
import request from '../../helpers/request'

test('POST /boletos', async (t) => {
  const { status, data } = await request({
    route: '/boletos',
    method: 'POST',
    data: mock,
  })

  t.is(status, 201)
  t.is(data.object, 'boleto')

  t.true(data.title_id != null)
  t.true(data.barcode != null)
  t.true(data.issuer_response_code != null)
  t.true(typeof data.title_id === 'number')
  t.true(typeof data.issuer_response_code === 'string')

  assert.containSubset(data, {
    status: 'registered',
    paid_amount: 0,
    amount: mock.amount,
    instructions: mock.instructions,
    issuer: mock.issuer,
    issuer_id: null,
    payer_name: mock.payer_name,
    payer_document_type: mock.payer_document_type,
    payer_document_number: mock.payer_document_number,
    company_name: mock.company_name,
    company_document_number: mock.company_document_number,
    queue_url: mock.queue_url,
  })
})

test('POST /boletos with invalid parameters', async (t) => {
  const { status, data } = await request({
    route: '/boletos',
    method: 'POST',
    data: mock,
  })

  t.is(status, 201)
  t.is(data.object, 'boleto')

  t.true(data.title_id != null)
  t.true(data.barcode != null)
  t.true(data.issuer_response_code != null)
  t.true(typeof data.title_id === 'number')
  t.true(typeof data.issuer_response_code === 'string')

  assert.containSubset(data, {
    status: 'registered',
    paid_amount: 0,
    amount: mock.amount,
    instructions: mock.instructions,
    issuer: mock.issuer,
    issuer_id: null,
    payer_name: mock.payer_name,
    payer_document_type: mock.payer_document_type,
    payer_document_number: mock.payer_document_number,
    company_name: mock.company_name,
    company_document_number: mock.company_document_number,
    queue_url: mock.queue_url,
  })
})
