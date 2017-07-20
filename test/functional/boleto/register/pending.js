import test from 'ava'
import { Promise, promisify } from 'bluebird'
import { always } from 'ramda'
import { mock, mockFunction, restoreFunction } from '../../../helpers/boleto'
import { normalizeHandler } from '../../../helpers/normalizer'
import * as boletoHandler from '../../../../build/resources/boleto'
import * as provider from '../../../../build/providers/bradesco'

const create = normalizeHandler(boletoHandler.create)

const register = promisify(boletoHandler.register)

test('registers a boleto (provider pending)', async (t) => {
  mockFunction(
    provider,
    'register',
    always(Promise.resolve({ status: 'unknown' }))
  )

  const payload = {
    expiration_date: new Date(),
    amount: 2000,
    issuer: 'bradesco',
    instructions: 'Please do not accept after expiration_date',
    register: false,
    queue_url: 'http://yopa/queue/test',
    company_name: 'Some Company',
    company_document_number: '98154524872'
  }

  const { body } = await create({
    body: payload
  })

  const boleto = await register({
    body: JSON.stringify({
      boleto_id: body.id,
      sqsMessage: {
        ReceiptHandle: 'abc'
      }
    })
  }, {})

  t.is(boleto.status, 'pending_registration')

  restoreFunction(provider, 'register')
})

test('registers a boleto (provider timeout -> pending)', async (t) => {
  mockFunction(
    provider,
    'register',
    always(Promise.resolve({ status: 'unknown' }).delay(6000))
  )

  const payload = mock

  const { body } = await create({
    body: payload
  })

  const boleto = await register({
    body: JSON.stringify({
      boleto_id: body.id,
      sqsMessage: {
        ReceiptHandle: 'abc'
      }
    })
  }, {})

  t.is(boleto.status, 'pending_registration')

  restoreFunction(provider, 'register')
})
