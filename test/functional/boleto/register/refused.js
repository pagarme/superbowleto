import test from 'ava'
import { Promise, promisify } from 'bluebird'
import { mock, mockFunction, restoreFunction, userQueueUrl, userQueue } from '../../../helpers/boleto'
import { normalizeHandler } from '../../../helpers/normalizer'
import * as boletoHandler from '../../../../build/resources/boleto'
import * as provider from '../../../../build/providers/bradesco'
import { findItemOnQueue, purgeQueue } from '../../../helpers/sqs'

const create = normalizeHandler(boletoHandler.create)

const register = promisify(boletoHandler.register)

test.before(() => {
  mockFunction(provider, 'register', () => Promise.resolve({ status: 'refused' }))
  purgeQueue(userQueue)
})

test.after(() => {
  restoreFunction(provider, 'register')
})

test('registers a boleto (provider refused)', async (t) => {
  const payload = {
    expiration_date: new Date(),
    amount: 2000,
    issuer: 'bradesco',
    instructions: 'Please do not accept after expiration_date',
    register: false,
    queue_url: userQueueUrl,
    company_name: 'Some Company',
    company_document_number: '98154524872'
  }

  const { body } = await create({
    body: payload
  })

  const boleto = await register({
    body: JSON.stringify({ boleto_id: body.id, sqsMessage: { ReceiptHandle: 'abc' } })
  }, {})

  const userSQSItem = await findItemOnQueue(
    userQueue,
    item => item.boleto_id === body.id
  )

  t.true(userSQSItem.boleto_id === body.id)
  t.true(userSQSItem.status === 'refused')
  t.is(boleto.status, 'refused')
})

test('try to register already refused boleto', async (t) => {
  const payload = mock

  const { body } = await create({
    body: payload
  })

  const boleto = await register({
    body: JSON.stringify({ boleto_id: body.id, sqsMessage: { ReceiptHandle: 'abc' } })
  }, {})

  t.is(boleto.status, 'refused')
})
