import test from 'ava'
import Promise, { promisify } from 'bluebird'
import { assert } from '../../../helpers/chai'
import { normalizeHandler } from '../../../helpers/normalizer'
import * as boletoHandler from '../../../../build/resources/boleto'
import { mock, userQueue, mockFunction, restoreFunction } from '../../../helpers/boleto'
import * as provider from '../../../../build/providers/bradesco'
import { findItemOnQueue, purgeQueue } from '../../../helpers/sqs'
import lambda from '../../../../build/resources/boleto/lambda'
import { BoletosToRegisterQueue } from '../../../../build/resources/boleto/queues'

const create = normalizeHandler(boletoHandler.create)

const processBoletosToRegister = promisify(boletoHandler.processBoletosToRegister)

test.before(async () => {
  mockFunction(provider, 'register', () => Promise.resolve({ status: 'unknown' }))

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
    })
  )
})

test.after(async () => {
  restoreFunction(provider, 'register')
  restoreFunction(lambda, 'register')
})

test('process many boletos (provider registered)', async (t) => {
  mockFunction(provider, 'register', () => Promise.resolve({ status: 'registered' }))

  await processBoletosToRegister({}, {})

  const userSQSItem = await findItemOnQueue(userQueue, () => true)

  t.true(userSQSItem.status === 'registered')
})
