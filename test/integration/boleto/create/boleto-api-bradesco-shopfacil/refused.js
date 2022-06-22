import test from 'ava'
import Promise from 'bluebird'
import cuid from 'cuid'
import axios from 'axios'
import sinon from 'sinon'
import database from '../../../../../src/database'
import boletoHandler from '../../../../../src/resources/boleto'
import Provider from '../../../../../src/providers/boleto-api-bradesco-shopfacil'
import { assert } from '../../../../helpers/chai'
import { normalizeHandler } from '../../../../helpers/normalizer'
import { mock, mockFunction, restoreFunction, createBoleto } from '../../../../helpers/boleto'
import { createConfig } from '../../../../helpers/configuration'


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

test('sendRequestToBoletoApi: with a timeout error', async (t) => {
  const timeoutMs = 25000
  const operationId = cuid()
  const boleto = await createBoleto()
  const payload = Provider.buildPayload(boleto, operationId)
  const headers = Provider.buildHeaders()
  const expectedAxiosError = ({
    code: 'ECONNABORTED',
  })

  const requestStub = sinon.stub(axios, 'request').rejects(expectedAxiosError)

  const result = await Provider.sendRequestToBoletoApi(payload, headers)

  t.deepEqual(
    result,
    {
      data: {
        errors: [{
          code: 'ECONNABORTED',
          message: `A requisição à BoletoApi excedeu o tempo limite de ${timeoutMs}ms`,
        }],
      },
    }
  )

  requestStub.restore()
})

test('sendRequestToBoletoApi: with BadRequest error', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto()
  const payload = Provider.buildPayload(boleto, operationId)
  const headers = Provider.buildHeaders()
  const expectedAxiosError = {
    response: {
      status: 400,
    },
  }

  const axiosRequestStub = sinon.stub(axios, 'request').rejects(expectedAxiosError)

  const result = await Provider.sendRequestToBoletoApi(payload, headers)

  t.is(
    result.status,
    400
  )

  axiosRequestStub.restore()
})

test('sendRequestToBoletoApi: with a not mapped error', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto()
  const payload = Provider.buildPayload(boleto, operationId)
  const headers = Provider.buildHeaders()
  const expectedAxiosError = ({
    code: 'NotMappedError',
  })

  const requestStub = sinon.stub(axios, 'request').rejects(expectedAxiosError)
  const error =
    await t.throws(Provider.sendRequestToBoletoApi(payload, headers))

  t.is(error.code, expectedAxiosError.code)

  requestStub.restore()
})
