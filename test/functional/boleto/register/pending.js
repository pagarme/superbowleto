import test from 'ava'
import { Promise, promisify } from 'bluebird'
import { mock, mockFunction, restoreFunction } from '../../../helpers/boleto'
import { normalizeHandler } from '../../../helpers/normalizer'
import * as boletoHandler from '../../../../build/resources/boleto'
import * as provider from '../../../../build/providers/bradesco'

test.before(async () => {
  mockFunction(provider, 'register', () => Promise.resolve({ status: 'unknown' }))
})

test.after(() => {
  restoreFunction(provider, 'register')
})

const create = normalizeHandler(boletoHandler.create)

const register = promisify(boletoHandler.register)

test('registers a boleto (provider pending)', async (t) => {
  const { body } = await create({
    body: mock
  })

  const boleto = await register({
    body: JSON.stringify({ boleto_id: body.id, sqsMessage: { ReceiptHandle: 'abc' } })
  }, {})

  t.is(boleto.status, 'pending_registration')
})
