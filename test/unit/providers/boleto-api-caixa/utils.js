import test from 'ava'
import {
  resolvesWhenHaveErrorsInResponse,
  resolvesWhenNotHaveErrorsInResponse,
  resolvesWhenIsSuccessInResponse,
  resolvesDefaultTranslateError,
  NotFoundParamsError,
} from '../../../../src/providers/boleto-api-caixa/utils'

test('resolvesDefaultTranslateError: when the function receive a not found params error', (t) => {
  const notFoundError = new NotFoundParamsError('Not found params')

  const result = resolvesDefaultTranslateError(notFoundError)

  t.is(result.message, 'Not found params')
  t.is(result.status, 'refused')
  t.is(result.issuer_response_code, 'NOT_FOUND_PARAMS')
})

test('resolvesDefaultTranslateError: when the function receive a generic error', (t) => {
  const error = new Error('Error generic')

  const result = resolvesDefaultTranslateError(error)

  t.is(result.message, 'Register operation failed at Caixa')
  t.is(result.status, 'refused')
  t.is(result.issuer_response_code, 'defaultErrorCode')
})

test('resolvesWhenIsSuccessInResponse: with response missing barcode', (t) => {
  const error = t.throws(() => {
    resolvesWhenIsSuccessInResponse({
      barcode: undefined,
      boletoUrl: 'https://blablahtml.com',
      digitableLine: '98139178390283012831893193103293',
    })
  })

  t.is(error.message, 'código de barras do boleto não foi retornado')
})

test('resolvesWhenIsSuccessInResponse: with response missing boletoUrl', (t) => {
  const error = t.throws(() => {
    resolvesWhenIsSuccessInResponse({
      barcode: '804284028402804820482',
      boletoUrl: undefined,
      digitableLine: '98139178390283012831893193103293',
    })
  })

  t.is(error.message, 'URL do boleto não foi retornada')
})

test('resolvesWhenIsSuccessInResponse: with response missing digitableLine', (t) => {
  const error = t.throws(() => {
    resolvesWhenIsSuccessInResponse({
      barcode: '804284028402804820482',
      boletoUrl: 'https://blablapdf.com',
      digitableLine: undefined,
    })
  })

  t.is(error.message, 'linha digitável do boleto não foi retornada')
})


test('resolvesWhenNotHaveErrorsInResponse: when the function receive the parameters', (t) => {
  const result = resolvesWhenNotHaveErrorsInResponse(503, 'Service Unavailable')

  t.is(result.message, 'Service Unavailable')
  t.is(result.status, 'refused')
  t.is(result.issuer_response_code, '503')
})

test('resolvesWhenNotHaveErrorsInResponse: when the function not receive the parameters', (t) => {
  const result = resolvesWhenNotHaveErrorsInResponse()

  t.is(result.message, 'Register operation failed at Caixa')
  t.is(result.status, 'refused')
  t.is(result.issuer_response_code, 'defaultErrorCode')
})

test('resolvesWhenHaveErrorsInResponse: when the receive a mapped error', (t) => {
  const response = {
    errors: [{ code: 'MP500', message: 'Internal error' }],
  }

  const result = resolvesWhenHaveErrorsInResponse(response)

  t.is(result.message, 'Internal error')
  t.is(result.status, 'refused')
  t.is(result.issuer_response_code, 'MP500')
})

test('resolvesWhenHaveErrorsInResponse: when the receive a not mapped error', (t) => {
  const response = {
    errors: [{ code: 'NotMappedError', message: 'Register operation failed at Caixa' }],
  }

  const result = resolvesWhenHaveErrorsInResponse(response)

  t.is(result.message, 'Register operation failed at Caixa')
  t.is(result.status, 'refused')
  t.is(result.issuer_response_code, 'NotMappedError')
})

