import test from 'ava'
import Promise from 'bluebird'
import cuid from 'cuid'
import nock from 'nock'
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
        status: 'registered',
        issuer_response_code: '0',
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
  })
})

test('creates a boleto with rules: changing issuer to bradesco', async (t) => {
  const payload = mock

  payload.issuer = 'boleto-api-bradesco-shopfacil'
  payload.rules = ['no_strict']
  payload.external_id = externalId
  payload.interest = undefined
  payload.fine = undefined

  nock.cleanAll()

  nock('https://homolog.meiosdepagamentobradesco.com.br')
    .post('/apiregistro/api')
    .reply(201, {
      data: {
        boleto: {
          nosso_numero: 10203040,
          numero_documento: '10203040',
          data_registro: '2021-01-05T17:24:05',
          data_requisicao: '2021-01-05T17:24:04',
        },
      },
      status: {
        codigo: 0,
        mensagem: 'REGISTRO EFETUADO COM SUCESSO - CIP NAO CONFIRMADA',
      },
    })

  const { body, statusCode } = await create({
    body: payload,
  })

  nock.cleanAll()

  t.is(statusCode, 201)
  t.is(body.object, 'boleto')
  t.is(body.issuer, 'bradesco')
  t.is(body.issuer_wallet, '26')

  t.true(body.title_id != null)
  t.true(body.barcode != null)
  t.true(typeof body.title_id === 'number')

  assert.containSubset(body, {
    status: 'registered',
    paid_amount: 0,
    amount: payload.amount,
    instructions: payload.instructions,
    issuer: 'bradesco',
    issuer_id: null,
    payer_name: payload.payer_name,
    payer_document_type: payload.payer_document_type,
    payer_document_number: payload.payer_document_number,
    company_name: payload.company_name,
    company_document_number: payload.company_document_number,
    queue_url: payload.queue_url,
  })
})
