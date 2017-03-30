import test from 'ava'
import { assert } from '../../helpers/chai'
import { findItemOnQueue, purgeQueue } from '../../helpers/sqs'
import { normalizeHandler } from '../../helpers/normalizer'
import { createQueue } from '../queue/helpers'
import { boletoMock } from './helpers'
import * as boletoHandler from '../../../src/resources/boleto'
import { BoletosToRegisterQueue } from '../../../src/resources/boleto/queues'

const create = normalizeHandler(boletoHandler.create)

test.before(async () => {
  await purgeQueue(BoletosToRegisterQueue)
})

test('creates a boleto', async (t) => {
  const queue = await createQueue()
  const payload = Object.assign({}, boletoMock, {
    queue_id: queue.id
  })

  const { body, statusCode } = await create({
    body: payload
  })

  t.is(statusCode, 201)
  t.is(body.object, 'boleto')
  t.true(body.title_id != null)
  t.true(typeof body.title_id === 'number')
  assert.containSubset(body, {
    status: 'issued',
    paid_amount: 0,
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'bradesco',
    issuer_id: null,
    payer_name: 'John Appleseed',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872'
  })

  const sqsItem = await findItemOnQueue(
    item => item.boleto_id === body.id,
    BoletosToRegisterQueue
  )

  t.is(sqsItem.boleto_id, body.id, 'posts an item to `boletos-to-register` sqs queue with a `boleto_id` property`')
  t.is(sqsItem.issuer, body.issuer, 'posts an item to `boletos-to-register` sqs queue with a `issuer` property`')
})

test('creates a boleto with invalid data', async (t) => {
  const payload = {
    expiration_date: true,
    issuer: 100,
    payer_document_type: 'xxx'
  }

  const { body, statusCode } = await create({
    body: payload
  })

  t.is(statusCode, 400)
  assert.containSubset(body, {
    errors: [{
      type: 'invalid_parameter',
      message: '"queue_id" is required',
      field: 'queue_id'
    }, {
      type: 'invalid_parameter',
      message: '"expiration_date" must be a number of milliseconds or valid date string',
      field: 'expiration_date'
    }, {
      type: 'invalid_parameter',
      message: '"amount" is required',
      field: 'amount'
    }, {
      type: 'invalid_parameter',
      message: '"issuer" must be a string',
      field: 'issuer'
    }, {
      type: 'invalid_parameter',
      message: '"payer_name" is required',
      field: 'payer_name'
    }, {
      type: 'invalid_parameter',
      message: '"payer_document_type" must be one of [cpf, cnpj]',
      field: 'payer_document_type'
    }, {
      type: 'invalid_parameter',
      message: '"payer_document_number" is required',
      field: 'payer_document_number'
    }]
  })
})
