import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { createBoleto } from './helpers'
import * as boletoHandler from '../../../src/resources/boleto'

const indexBoleto = normalizeHandler(boletoHandler.index)

test.before(async () => {
  await Promise.all([...Array(15)].map(createBoleto))
})

test('shows all boletos with default pagination', async (t) => {
  const { body, statusCode } = await indexBoleto()
  const item = body[0]

  t.is(statusCode, 200)
  t.is(body.length, 10, 'should have the default 10 items on the result')
  t.is(item.object, 'boleto')
  assert.containSubset(item, {
    status: 'issued',
    paid_amount: 0,
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'bradesco',
    issuer_id: null,
    payer_name: 'David Bowie',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872'
  }, 'result must have the shape of a boleto')
})

test('shows all boletos with custom pagination', async (t) => {
  const { body, statusCode } = await indexBoleto({
    queryStringParameters: {
      count: 2
    }
  })
  const item = body[0]

  t.is(statusCode, 200)
  t.is(body.length, 2, 'should have 2 items on the result')
  t.is(item.object, 'boleto')
  assert.containSubset(item, {
    status: 'issued',
    paid_amount: 0,
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'bradesco',
    issuer_id: null,
    payer_name: 'David Bowie',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872'
  }, 'result must have the shape of a boleto')
})
