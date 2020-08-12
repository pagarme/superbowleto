import test from 'ava'
import Promise from 'bluebird'
import cuid from 'cuid'
import { assert } from '../../../../helpers/chai'
import { normalizeHandler } from '../../../../helpers/normalizer'
import { mock, mockFunction, restoreFunction } from '../../../../helpers/boleto'
import boletoHandler from '../../../../../src/resources/boleto'
import Provider from '../../../../../src/providers/boleto-api-bradesco-shopfacil'
import { findItemOnQueue, purgeQueue } from '../../../../helpers/sqs'
import { BoletosToRegisterQueue } from '../../../../../src/resources/boleto/queues'
import { createConfig } from '../../../../helpers/configuration'
import database from '../../../../../src/database'

const { Configuration } = database.models
const create = normalizeHandler(boletoHandler.create)
const externalId = cuid()

test.before(async () => {
  await createConfig({
    issuer: 'boleto-api-bradesco-shopfacil',
    external_id: externalId,
  })

  mockFunction(Provider, 'getProvider', () => ({
    register () {
      return Promise.resolve({
        status: 'unknown',
        issuer_response_code: '-548',
      })
    },
  }))

  await purgeQueue(BoletosToRegisterQueue)
})

test.after(async () => {
  restoreFunction(Provider, 'getProvider')
  await Configuration.destroy({
    where: {
      external_id: externalId,
    },
  })
})

test('creates a boleto (status unknown)', async (t) => {
  const payload = mock

  payload.issuer = 'boleto-api-bradesco-shopfacil'
  payload.external_id = externalId
  payload.interest = undefined
  payload.fine = undefined

  const { body, statusCode } = await create({
    body: payload,
  })

  const sqsItem = await findItemOnQueue(
    BoletosToRegisterQueue,
    item => item.boleto_id === body.id
  )

  t.is(sqsItem.boleto_id, body.id)
  t.is(statusCode, 201)
  t.is(body.object, 'boleto')

  t.true(body.title_id != null)
  t.true(body.barcode != null)
  t.true(typeof body.title_id === 'number')

  assert.containSubset(body, {
    status: 'pending_registration',
    issuer_response_code: '-548',
    paid_amount: 0,
    amount: payload.amount,
    instructions: payload.instructions,
    issuer: payload.issuer,
    issuer_id: null,
    payer_name: payload.payer_name,
    payer_document_type: payload.payer_document_type,
    payer_document_number: payload.payer_document_number,
    company_name: payload.company_name,
    company_document_number: payload.company_document_number,
    queue_url: payload.queue_url,
  })
})
