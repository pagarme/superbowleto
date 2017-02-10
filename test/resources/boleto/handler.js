import test from 'ava'
import { assert } from '../../utils/chai'
import { normalizeHandler } from '../../utils/normalizer'
import { models } from '../../../src/database'
import * as boleto from '../../../src/resources/boleto/handler'

const create = normalizeHandler(boleto.create)

const queueMock = {
  name: 'test-queue',
  url: 'http://yopa/queue/test'
}

const boletoMock = {
  status: 'pending_registration',
  expiration_date: new Date(),
  amount: 2000,
  instructions: 'Please do not accept after expiration_date',
  issuer: 'bradesco',
  issuer_id: 'ciz04q0oi000001ppjf0lq4pa',
  payer_name: 'John Appleseed',
  payer_document_type: 'cpf',
  payer_document_number: '98154524872'
}

test.only('creates a boleto', async (t) => {
  const queue = (await models.queue.create(queueMock)).dataValues

  const { body, statusCode } = await create({
    body: Object.assign({}, boletoMock, { queue_id: queue.id })
  })

  t.is(statusCode, 201)
  t.is(body.paid_amount, 0)
  t.true(body.title_id != null)
  t.true(typeof body.title_id === 'number')

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
