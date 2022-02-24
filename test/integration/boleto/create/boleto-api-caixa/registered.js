import test from 'ava'
import Promise from 'bluebird'
import cuid from 'cuid'
import { assert } from '../../../../helpers/chai'
import { normalizeHandler } from '../../../../helpers/normalizer'
import { mock, mockFunction, restoreFunction } from '../../../../helpers/boleto'
import boletoHandler from '../../../../../src/resources/boleto'
import Provider from '../../../../../src/providers/boleto-api-caixa'
import { createConfig } from '../../../../helpers/configuration'
import database from '../../../../../src/database'

const create = normalizeHandler(boletoHandler.create)
const { Configuration } = database.models
const externalId = cuid()

test.before(async () => {
  await createConfig({
    issuer: 'boleto-api-caixa',
    external_id: externalId,
  })

  mockFunction(Provider, 'getProvider', () => ({
    register () {
      return Promise.resolve({
        status: 'registered',
        issuer_response_code: '0',
        boleto_url: 'boletocaixa.com',
        digitable_line: '1234.5678',
        barcode: '123',
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

test('creates a boleto (status success)', async (t) => {
  const payload = mock

  payload.issuer = 'boleto-api-caixa'
  payload.external_id = externalId

  const { body, statusCode } = await create({
    body: payload,
  })

  t.is(statusCode, 201)
  t.is(body.object, 'boleto')

  t.true(body.title_id != null)
  t.true(body.barcode != null)
  t.true(typeof body.title_id === 'number')

  assert.containSubset(body, {
    status: 'registered',
    issuer_response_code: '0',
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
    boleto_url: 'boletocaixa.com',
    digitable_line: '1234.5678',
    barcode: '123',
  })
})
