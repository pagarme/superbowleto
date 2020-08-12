import test from 'ava'
import Promise from 'bluebird'
import cuid from 'cuid'
import { assert } from '../../../../helpers/chai'
import { normalizeHandler } from '../../../../helpers/normalizer'
import { mock, mockFunction, restoreFunction } from '../../../../helpers/boleto'
import boletoHandler from '../../../../../src/resources/boleto'
import Provider from '../../../../../src/providers/boleto-api-bradesco-shopfacil'
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
        status: 'refused',
        issuer_response_code: '-546',
      })
    },
  }))
})

test.after(async () => {
  restoreFunction(Provider, 'getProvider')
  await Configuration.destroy({
    where: {
      external_id: externalId,
    },
  })
})

test('creates a boleto (status refused)', async (t) => {
  const payload = mock

  payload.issuer = 'boleto-api-bradesco-shopfacil'
  payload.external_id = externalId
  payload.interest = undefined
  payload.fine = undefined

  const { body, statusCode } = await create({
    body: payload,
  })

  t.is(statusCode, 201)
  t.is(body.object, 'boleto')

  t.true(body.title_id != null)
  t.true(body.barcode != null)
  t.true(typeof body.title_id === 'number')

  assert.containSubset(body, {
    status: 'refused',
    issuer_response_code: '-546',
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
