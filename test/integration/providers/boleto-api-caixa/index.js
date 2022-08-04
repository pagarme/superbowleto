import test from 'ava'
import axios from 'axios'
import sinon from 'sinon'

import { createBoleto } from '../../../helpers/boleto'
import Provider from '../../../../src/providers/boleto-api-caixa'

const { register } = Provider.getProvider()

test('register: when the register function not received the boleto', async (t) => {
  const registerResponse = await register()

  t.is(registerResponse.message, 'Register operation failed at Caixa')
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, 'defaultErrorCode')
})

test('register: when the sendRequestToBoletoApi function return a not mapped error', async (t) => {
  const boleto = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    code: 'NotMappedError',
  }

  const axiosRequestStub = sinon
    .stub(axios, 'request')
    .rejects(expectedAxiosError)

  const registerResponse = await register(boleto)

  t.is(registerResponse.message, 'Register operation failed at Caixa')
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, expectedAxiosError.code)

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function return a timeout error', async (t) => {
  const boleto = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    code: 'ECONNABORTED',
  }
  const timeoutMs = 25000

  const axiosRequestStub = sinon
    .stub(axios, 'request')
    .rejects(expectedAxiosError)

  const registerResponse = await register(boleto)

  t.is(
    registerResponse.message,
    `A requisição à BoletoApi excedeu o tempo limite de ${timeoutMs}ms`
  )
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, expectedAxiosError.code)

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function return a statusCode 40X', async (t) => {
  const boleto = await createBoleto({
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

  const registerResponse = await register(boleto)

  t.is(
    registerResponse.message,
    'Unauthorized'
  )
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, 'MP401')

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function return a statusCode 50X with error', async (t) => {
  const boleto = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    response: {
      status: 500,
      data: {
        errors: [{ code: 'MP500', message: 'Internal error' }],
      },
    },
  }

  const axiosRequestStub = sinon
    .stub(axios, 'request')
    .rejects(expectedAxiosError)

  const registerResponse = await register(boleto)

  t.is(
    registerResponse.message,
    'Internal error'
  )
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, 'MP500')

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function return a statusCode 50X without error', async (t) => {
  const boleto = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    response: {
      status: 503,
      statusText: 'Service Unavailable',
      data: undefined,
    },
  }

  const axiosRequestStub = sinon
    .stub(axios, 'request')
    .rejects(expectedAxiosError)

  const registerResponse = await register(boleto)

  t.is(
    registerResponse.message,
    'Service Unavailable'
  )
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, '503')

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function return success', async (t) => {
  const boleto = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    status: 200,
    data: {
      id: boleto.id,
      digitableLine: boleto.digitable_line,
      barCodeNumber: boleto.barcode,
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

  const registerResponse = await register(boleto)

  t.is(registerResponse.status, 'registered')
  t.is(registerResponse.issuer_response_code, '0')

  t.deepEqual(
    registerResponse,
    {
      message: 'REGISTRO EFETUADO COM SUCESSO',
      status: 'registered',
      issuer_response_code: '0',
      boleto_url: 'https://test-html.com',
      digitable_line: boleto.digitable_line,
      barcode: boleto.barcode,
    }
  )

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function not return digitableLine parameter in the boleto', async (t) => {
  const boleto = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    status: 200,
    data: {
      id: boleto.id,
      digitableLine: undefined,
      barCodeNumber: boleto.barcode,
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

  const registerResponse = await register(boleto)

  t.is(registerResponse.message, 'linha digitável do boleto não foi retornada')
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, 'NOT_FOUND_PARAMS')

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function not return barCodeNumber parameter in the boleto', async (t) => {
  const boleto = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    status: 200,
    data: {
      id: boleto.id,
      digitableLine: boleto.digitable_line,
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

  const registerResponse = await register(boleto)

  t.is(registerResponse.message, 'código de barras do boleto não foi retornado')
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, 'NOT_FOUND_PARAMS')

  axiosRequestStub.restore()
})

test('register: when the sendRequestToBoletoApi function not return the html link parameter in the boleto', async (t) => {
  const boleto = await createBoleto({
    issuer: 'boleto-api-caixa',
  })
  const expectedAxiosError = {
    status: 200,
    data: {
      id: boleto.id,
      digitableLine: boleto.digitable_line,
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

  const registerResponse = await register(boleto)

  t.is(registerResponse.message, 'URL do boleto não foi retornada')
  t.is(registerResponse.status, 'refused')
  t.is(registerResponse.issuer_response_code, 'NOT_FOUND_PARAMS')

  axiosRequestStub.restore()
})
