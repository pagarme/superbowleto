import test from 'ava'
import {
  translateResponseWithErrors,
  translateResponseWithoutErrors,
  translateResponseWithSuccess,
  translateDefaultError,
  NotFoundParamsError,
} from '../../../../src/providers/boleto-api-caixa/translate-utils'

test('translateDefaultError: when receive a not found params error then should be returned a status "refused" and personalized message with code "NOT_FOUND_PARAMS"', (t) => {
  const notFoundError = new NotFoundParamsError('Not found params')

  const result = translateDefaultError(notFoundError)

  t.is(result.message, 'Not found params')
  t.is(result.status, 'refused')
  t.is(result.issuer_response_code, 'NOT_FOUND_PARAMS')
})

test('translateDefaultError: when receive a generic error then should be returned a status "refused" and default message and code', (t) => {
  const error = new Error('Error generic')

  const result = translateDefaultError(error)

  t.is(result.message, 'Register operation failed at Caixa')
  t.is(result.status, 'refused')
  t.is(result.issuer_response_code, 'defaultErrorCode')
})

test('translateResponseWithSuccess: with response missing barcode then should return a exception with personalized message', (t) => {
  const error = t.throws(() => {
    translateResponseWithSuccess({
      barcode: undefined,
      boletoUrl: 'https://blablahtml.com',
      digitableLine: '98139178390283012831893193103293',
    })
  })

  t.is(error.message, 'código de barras do boleto não foi retornado')
})

test('translateResponseWithSuccess: with response missing boletoUrl then should return a exception with personalized message', (t) => {
  const error = t.throws(() => {
    translateResponseWithSuccess({
      barcode: '804284028402804820482',
      boletoUrl: undefined,
      digitableLine: '98139178390283012831893193103293',
    })
  })

  t.is(error.message, 'URL do boleto não foi retornada')
})

test('translateResponseWithSuccess: with response missing digitableLine then should return a exception with personalized message', (t) => {
  const error = t.throws(() => {
    translateResponseWithSuccess({
      barcode: '804284028402804820482',
      boletoUrl: 'https://blablapdf.com',
      digitableLine: undefined,
    })
  })

  t.is(error.message, 'linha digitável do boleto não foi retornada')
})


test('translateResponseWithoutErrors: when receive the parameters then should be returned a status "refused" with them', (t) => {
  const result = translateResponseWithoutErrors(503, 'Service Unavailable')

  t.is(result.message, 'Service Unavailable')
  t.is(result.status, 'refused')
  t.is(result.issuer_response_code, '503')
})

test('translateResponseWithoutErrors: when not receive the parameters then should be returned a status "refused" and default message error and code', (t) => {
  const result = translateResponseWithoutErrors()

  t.is(result.message, 'Register operation failed at Caixa')
  t.is(result.status, 'refused')
  t.is(result.issuer_response_code, 'defaultErrorCode')
})

test('translateResponseWithErrors: when the receive a mapped error then should be returned a status "refused" and pass on message and code received', (t) => {
  const response = {
    errors: [{ code: 'MP500', message: 'Internal error' }],
  }

  const result = translateResponseWithErrors(response)

  t.is(result.message, 'Internal error')
  t.is(result.status, 'refused')
  t.is(result.issuer_response_code, 'MP500')
})

test('translateResponseWithErrors: when the receive a not mapped error then should be returned a status "refused" and default message with error', (t) => {
  const response = {
    errors: [{ code: 'NotMappedError', message: 'Register operation failed at Caixa' }],
  }

  const result = translateResponseWithErrors(response)

  t.is(result.message, 'Register operation failed at Caixa')
  t.is(result.status, 'refused')
  t.is(result.issuer_response_code, 'NotMappedError')
})

