import test from 'ava'
import axios from 'axios'
import sinon from 'sinon'

import { createBoleto } from '../../../helpers/boleto'
import Provider from '../../../../src/providers/boleto-api-caixa'

const { register } = Provider.getProvider()

test('register: when the register function not received the billet', async (t) => {
  const registerResponse = await register()

  t.is(registerResponse.message, 'Register operation failed at Caixa')
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, 'defaultErrorCode')
})

test('register: when the sendRequestToBoletoApi function return a not mapped error', async (t) => {
  const billet = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    code: 'NotMappedError',
  }

  const axiosRequestStub = sinon
    .stub(axios, 'request')
    .rejects(expectedAxiosError)

  const registerResponse = await register(billet)

  t.is(registerResponse.message, 'Register operation failed at Caixa')
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, 'defaultErrorCode')

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function return a timeout error', async (t) => {
  const billet = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    code: 'ECONNABORTED',
  }
  const timeoutMs = 25000

  const axiosRequestStub = sinon
    .stub(axios, 'request')
    .rejects(expectedAxiosError)

  const registerResponse = await register(billet)

  t.is(
    registerResponse.message,
    `A requisição à BoletoApi excedeu o tempo limite de ${timeoutMs}ms`
  )
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, expectedAxiosError.code)

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function return a statusCode 40X', async (t) => {
  const billet = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    response: {
      status: 401,
      data: {
        errors: [{ code: 'MP401', message: 'Unauthorized' }],
      },
    },
  }

  const axiosRequestStub = sinon
    .stub(axios, 'request')
    .rejects(expectedAxiosError)

  const registerResponse = await register(billet)

  t.is(
    registerResponse.message,
    'Unauthorized'
  )
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, 'MP401')

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function return success', async (t) => {
  const billet = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    data: {
      id: billet.id,
      digitableLine: billet.digitable_line,
      barCodeNumber: billet.barcode,
      links: [{
        href: 'https://test-html.com',
        rel: 'html',
        method: 'GET',
      },
      {
        href: 'https://test-pdf.com',
        rel: 'PDF',
        method: 'GET',
      }],
    },
  }

  const axiosRequestStub = sinon
    .stub(axios, 'request')
    .resolves(expectedAxiosError)

  const registerResponse = await register(billet)

  t.is(registerResponse.status, 'registered')
  t.is(registerResponse.issuer_response_code, '0')

  t.deepEqual(
    registerResponse,
    {
      message: 'REGISTRO EFETUADO COM SUCESSO',
      status: 'registered',
      issuer_response_code: '0',
      boleto_url: 'https://test-html.com',
      digitable_line: billet.digitable_line,
      barcode: billet.barcode,
    }
  )

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function not return digitableLine parameter in the billet', async (t) => {
  const billet = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    data: {
      id: billet.id,
      digitableLine: undefined,
      barCodeNumber: billet.barcode,
      links: [{
        href: 'https://test-html.com',
        rel: 'html',
        method: 'GET',
      },
      {
        href: 'https://test-pdf.com',
        rel: 'PDF',
        method: 'GET',
      }],
    },
  }

  const axiosRequestStub = sinon
    .stub(axios, 'request')
    .resolves(expectedAxiosError)

  const registerResponse = await register(billet)

  t.is(registerResponse.message, 'Register operation failed at Caixa')
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, 'defaultErrorCode')

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function not return barCodeNumber parameter in the billet', async (t) => {
  const billet = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    data: {
      id: billet.id,
      digitableLine: billet.digitable_line,
      barCodeNumber: undefined,
      links: [{
        href: 'https://test-html.com',
        rel: 'html',
        method: 'GET',
      },
      {
        href: 'https://test-pdf.com',
        rel: 'PDF',
        method: 'GET',
      }],
    },
  }

  const axiosRequestStub = sinon
    .stub(axios, 'request')
    .resolves(expectedAxiosError)

  const registerResponse = await register(billet)

  t.is(registerResponse.message, 'Register operation failed at Caixa')
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, 'defaultErrorCode')

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function not return the html link parameter in the billet', async (t) => {
  const billet = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    data: {
      id: billet.id,
      digitableLine: billet.digitable_line,
      barCodeNumber: undefined,
      links: [{
        href: 'https://test-pdf.com',
        rel: 'PDF',
        method: 'GET',
      }],
    },
  }

  const axiosRequestStub = sinon
    .stub(axios, 'request')
    .resolves(expectedAxiosError)

  const registerResponse = await register(billet)

  t.is(registerResponse.message, 'Register operation failed at Caixa')
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, 'defaultErrorCode')

  axiosRequestStub.restore()
})
