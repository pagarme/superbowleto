import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { createBoleto } from './helpers'
import * as boletoHandler from '../../../src/resources/boleto/handler'

const show = normalizeHandler(boletoHandler.show)

test('shows an existing boleto', async (t) => {
  const boleto = await createBoleto()

  const { body, statusCode } = await show({
    pathParameters: {
      id: boleto.id
    }
  })

  t.is(statusCode, 200)
  t.is(body.id, boleto.id)
  t.is(body.object, 'boleto')
  assert.containSubset(body, {
    status: 'pending_registration',
    paid_amount: 0,
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'bradesco',
    issuer_id: null,
    payer_name: 'John Appleseed',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872'
  })
})

test('shows a non-existing boleto', async (t) => {
  const { statusCode } = await show({
    pathParameters: {
      id: 'boleto_xxx'
    }
  })

  t.is(statusCode, 404)
})
