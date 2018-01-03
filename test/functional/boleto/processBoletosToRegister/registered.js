import test from 'ava'
import Promise, { promisify } from 'bluebird'
import { normalizeHandler } from '../../../helpers/normalizer'
import boletoHandler from '../../../../src/resources/boleto'
import { mock, userQueue, mockFunction, restoreFunction } from '../../../helpers/boleto'
import Provider from '../../../../src/providers/bradesco'
import { findItemOnQueue, purgeQueue } from '../../../helpers/sqs'
import lambda from '../../../../src/resources/boleto/lambda'
import { BoletosToRegisterQueue } from '../../../../src/resources/boleto/queues'

const create = normalizeHandler(boletoHandler.create)

// eslint-disable-next-line
const processBoletosToRegister = promisify(boletoHandler.processBoletosToRegister)

test.before(async () => {
  mockFunction(Provider, 'getProvider', () => ({
    register () {
      return Promise.resolve({ status: 'unknown' })
    },
  }))

  await purgeQueue(BoletosToRegisterQueue)
  await purgeQueue(userQueue)
  await Promise.all([...Array(3)].map(() => create({ body: mock })))

  mockFunction(lambda, 'register', payload =>
    new Promise((resolve, reject) => {
      boletoHandler.register(payload, {}, (err, data) => {
        if (err) {
          return reject(err)
        }

        return resolve(data)
      })
    }))
})

test.after(async () => {
  restoreFunction(Provider, 'getProvider')
  restoreFunction(lambda, 'register')
})

test('process many boletos (provider registered)', async (t) => {
  mockFunction(Provider, 'getProvider', () => ({
    register () {
      return Promise.resolve({ status: 'registered' })
    },
  }))

  await processBoletosToRegister({}, {})

  const userSQSItem = await findItemOnQueue(userQueue, () => true)

  t.true(userSQSItem.status === 'registered')
})
