import test from 'ava'
import { is } from 'ramda'
import { assert } from '../../helpers/chai'
import request from '../../helpers/request'
import { mock, userQueueUrl } from '../../helpers/boleto'

test.skip('GET /boletos/:id with valid id', async (t) => {
  const { body: { id } } = await request({
    route: '/boletos',
    method: 'POST',
    data: mock,
    headers: {
      'x-api-key': 'abc123',
    },
  })

  const { body, statusCode } = await request({
    route: `/boletos/${id}`,
    method: 'GET',
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 200)
  t.true(is(Object, body))

  assert.containSubset(body, {
    object: 'boleto',
    id,
    status: 'registered',
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

test('GET /boletos/:id with invalid id', async (t) => {
  const INVALID_ID = 'INVALID_ID'

  const { body, statusCode } = await request({
    route: `/boletos/${INVALID_ID}`,
    method: 'GET',
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 404)
  t.true(is(Object, body))

  t.deepEqual(body, {
    errors: [
      {
        type: 'not_found',
        message: 'Boleto not found',
        field: null,
      },
    ],
  })
})
