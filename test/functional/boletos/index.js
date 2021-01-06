import test from 'ava'
import { is } from 'ramda'
import { assert } from '../../helpers/chai'
import request from '../../helpers/request'
import {
  createBoleto,
  userQueueUrl,
} from '../../helpers/boleto'
import database from '../../../src/database'

const { Boleto } = database.models

test.before(async () => {
  await Boleto.destroy({ where: {} })
  await Promise.all([...Array(25)].map(createBoleto))
})

test('GET /boletos', async (t) => {
  const { body, statusCode } = await request({
    route: '/boletos',
    method: 'GET',
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 200)
  t.true(is(Array, body))
  t.is(body.length, 10)

  const item = body[0]

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

test('GET /boletos with count', async (t) => {
  const { body, statusCode } = await request({
    route: '/boletos?count=2',
    method: 'GET',
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 200)
  t.true(is(Array, body))
  t.is(body.length, 2)

  const item = body[0]

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

test('GET /boletos with unknown parameters', async (t) => {
  const { body, statusCode } = await request({
    route: '/boletos?a="a"&b=2&c="c"',
    method: 'GET',
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 200)
  t.true(is(Array, body))
  t.is(body.length, 10)

  const item = body[0]

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
