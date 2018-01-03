import test from 'ava'
import { promisify } from 'bluebird'
import { mock, userQueue } from '../../../helpers/boleto'
import { findItemOnQueue, purgeQueue } from '../../../helpers/sqs'
import { normalizeHandler } from '../../../helpers/normalizer'
import boletoHandler from '../../../../src/resources/boleto'

const create = normalizeHandler(boletoHandler.create)

const register = promisify(boletoHandler.register)

test.before(async () => {
  await purgeQueue(userQueue)
})

test('registers a boleto (provider success)', async (t) => {
  const { body } = await create({
    body: mock,
  })

  const payload = {
    boleto_id: body.id,
    sqsMessage: {
      ReceiptHandle: 'abc',
    },
  }

  const boleto = await register(payload, {})

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
  const { body } = await create({
    body: mock,
  })

  const payload = {
    boleto_id: body.id,
    sqsMessage: {
      ReceiptHandle: 'abc',
    },
  }

  const boleto = await register(payload, {})

  t.is(boleto.status, 'registered')
})
