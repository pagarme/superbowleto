import test from 'ava'
import { assert } from '../../test-utils/chai'
import { normalizeHandler } from '../../test-utils/normalizer'
import { createBoleto } from './test-utils'
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
  assert.containSubset(body, {
    status: 'pending_registration',
    paid_amount: 0,
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'bradesco',
    issuer_id: 'ciz04q0oi000001ppjf0lq4pa',
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
