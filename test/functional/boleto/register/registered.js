import test from 'ava'
import { Promise, promisify } from 'bluebird'
import { mock, mockFunction, restoreFunction, userQueueUrl, userQueue } from '../../../helpers/boleto'
import { findItemOnQueue, purgeQueue } from '../../../helpers/sqs'
import { normalizeHandler } from '../../../helpers/normalizer'
import * as boletoHandler from '../../../../build/resources/boleto'
import * as provider from '../../../../build/providers/bradesco'

const create = normalizeHandler(boletoHandler.create)

const register = promisify(boletoHandler.register)

test.before(async () => {
  await purgeQueue(userQueue)
})

test('registers a boleto (provider success)', async (t) => {
  const { body } = await create({
    body: mock
  })

  const boleto = await register({
    body: JSON.stringify({ boleto_id: body.id, sqsMessage: { ReceiptHandle: 'abc' } })
  }, {})

  const userSQSItem = await findItemOnQueue(
    userQueue,
    item => item.boleto_id === body.id
  )

  // TODO test whether BoletosToRegisterQueue actually got empty?

  t.true(userSQSItem.boleto_id === body.id)
  t.true(userSQSItem.status === 'registered')
  t.is(boleto.status, 'registered')
})

test('try to register already registered boleto', async (t) => {
  const payload = mock

  const { body } = await create({
    body: payload
  })

  const boleto = await register({
    body: JSON.stringify({ boleto_id: body.id, sqsMessage: { ReceiptHandle: 'abc' } })
  }, {})

  t.is(boleto.status, 'registered')
})
