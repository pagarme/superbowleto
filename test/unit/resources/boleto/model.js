import test from 'ava'
import { buildResponse } from '../../../../src/resources/boleto/model'

test('buildResponse', async (t) => {
  const now = new Date()

  const input = {
    id: 'bol_cizec1xk2000001nyml04gwxp',
    queue_url: 'http://yopa/queue/test',
    status: 'issued',
    expiration_date: now,
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'bradesco',
    issuer_id: 'ciz04q0oi000001ppjf0lq4pa',
    payer_name: 'David Bowie',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872',
    created_at: now,
    updated_at: now,
    secret_field: 'this is secret'
  }

  const output = await buildResponse(input)

  t.true(output.secret_field == null, 'should not have a `secret_field` prop')
  t.deepEqual(output, {
    object: 'boleto',
    id: 'bol_cizec1xk2000001nyml04gwxp',
    queue_url: 'http://yopa/queue/test',
    status: 'issued',
    expiration_date: now,
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'bradesco',
    issuer_id: 'ciz04q0oi000001ppjf0lq4pa',
    payer_name: 'David Bowie',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872',
    created_at: now,
    updated_at: now
  }, 'should be a boleto object')
})
