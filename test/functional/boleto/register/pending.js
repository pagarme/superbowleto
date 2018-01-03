import test from 'ava'
import { Promise, promisify } from 'bluebird'
import { mock, mockFunction, restoreFunction } from '../../../helpers/boleto'
import { normalizeHandler } from '../../../helpers/normalizer'
import * as boletoHandler from '../../../../src/resources/boleto'
import * as Provider from '../../../../src/providers/bradesco'

test.before(async () => {
  mockFunction(Provider, 'getProvider', () => ({
    register () {
      return Promise.resolve({ status: 'unknown' })
    }
  }))
})

test.after(() => {
  restoreFunction(Provider, 'getProvider')
})

const create = normalizeHandler(boletoHandler.create)

const register = promisify(boletoHandler.register)

test('registers a boleto (provider pending)', async (t) => {
  const { body } = await create({
    body: mock
  })

  const payload = {
    boleto_id: body.id,
    sqsMessage: {
      ReceiptHandle: 'abc'
    }
  }

  const boleto = await register(payload, {})

  t.is(boleto.status, 'pending_registration')
})
