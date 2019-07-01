import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import { createBoleto, userQueueUrl } from '../../helpers/boleto'
import boletoHandler from '../../../src/resources/boleto'
import database from '../../../src/database'

const { Boleto } = database.models
const indexBoleto = normalizeHandler(boletoHandler.index)

test.before(async () => {
  await Boleto.destroy({ where: {} })
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
    payer_document_number: '98154524872',
    queue_url: userQueueUrl,
    company_name: 'Some Company',
    company_document_number: '98154524872',
  }, 'result must have the shape of a boleto')
})

test('shows all boletos with custom pagination', async (t) => {
  const { body, statusCode } = await indexBoleto({
    query: {
      count: 2,
    },
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
    payer_document_number: '98154524872',
    queue_url: userQueueUrl,
    company_name: 'Some Company',
    company_document_number: '98154524872',
  }, 'result must have the shape of a boleto')
})

test.skip('shows a boleto with a specific token', async (t) => {
  await createBoleto({
    token: 'sandbox_3r3regdgdsggdgdzgzd',
  })

  const { body, statusCode } = await indexBoleto({
    query: {
      token: 'sandbox_3r3regdgdsggdgdzgzd',
    },
  })

  const item = body[0]

  t.is(statusCode, 200)
  t.is(body.length, 1, 'should have 1 item on the result')
  t.is(item.object, 'boleto')
  assert.containSubset(item, {
    status: 'issued',
    paid_amount: 0,
    token: 'sandbox_3r3regdgdsggdgdzgzd',
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'bradesco',
    issuer_id: null,
    payer_name: 'David Bowie',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872',
    payer_address: {
      zipcode: '04551010',
      street: 'Rua Fidêncio Ramos',
      street_number: '308',
      complementary: '9º andar, conjunto 91',
      neighborhood: 'Vila Olímpia',
      city: 'São Paulo',
      state: 'SP',
    },
    queue_url: userQueueUrl,
    company_name: 'Some Company',
    company_document_number: '98154524872',
    company_address: {
      zipcode: '04547006',
      street_number: '1609',
      street: 'Rua Gomes de Carvalho',
      neighborhood: 'Vila Olimpia',
      city: 'São Paulo',
      state: 'SP',
    },
  }, 'result must have the shape of a boleto')
})
