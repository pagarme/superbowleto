import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { mock, createBoleto } from '../../helpers/boleto'
import boletoHandler from '../../../src/resources/boleto'

const show = normalizeHandler(boletoHandler.show)

test('shows an existing boleto', async (t) => {
  const boleto = await createBoleto()

  const { body, statusCode } = await show({
    params: {
      id: boleto.id,
    },
  })

  t.is(statusCode, 200)
  t.is(body.id, boleto.id)
  t.is(body.object, 'boleto')
  assert.containSubset(body, {
    status: 'issued',
    paid_amount: 0,
    amount: mock.amount,
    instructions: mock.instructions,
    issuer: mock.issuer,
    issuer_id: null,
    payer_name: mock.payer_name,
    payer_document_type: mock.payer_document_type,
    payer_document_number: mock.payer_document_number,
    queue_url: mock.queue_url,
    company_name: mock.company_name,
    company_document_number: mock.company_document_number,
  })
})

test('shows a non-existing boleto', async (t) => {
  const { statusCode } = await show({
    params: {
      id: 'boleto_xxx',
    },
  })

  t.is(statusCode, 404)
})
