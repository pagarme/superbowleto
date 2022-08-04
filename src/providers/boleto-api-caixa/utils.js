class NotFoundParamsError extends Error {
  constructor (message) {
    super(message)

    this.name = 'NotFoundParamsError'
    this.code = 'NOT_FOUND_PARAMS'
  }
}

const defaultMessageRegisterError = 'Register operation failed at Caixa'
const defaultIssuerCode = 'defaultErrorCode'

const translateResponseWithSuccess = ({
  boletoUrl, digitableLine, barcode,
}) => {
  if (!boletoUrl) {
    throw new NotFoundParamsError('URL do boleto não foi retornada')
  }

  if (!digitableLine) {
    throw new NotFoundParamsError('linha digitável do boleto não foi retornada')
  }

  if (!barcode) {
    throw new NotFoundParamsError('código de barras do boleto não foi retornado')
  }

  const defaultSuccessValue = {
    message: 'REGISTRO EFETUADO COM SUCESSO',
    status: 'registered',
    issuer_response_code: '0',
    boleto_url: boletoUrl,
    digitable_line: digitableLine,
    barcode,
  }

  return defaultSuccessValue
}

const translateResponseWithoutErrors =
  (
    statusCode,
    statusText = defaultMessageRegisterError
  ) => {
    const responseCode = statusCode || defaultIssuerCode
    const message = statusText || defaultMessageRegisterError

    const defaultBoletoApiError = {
      message,
      status: 'refused',
      issuer_response_code: responseCode.toString(),
    }

    return defaultBoletoApiError
  }

const translateResponseWithErrors = (axiosResponseData) => {
  const [firstError] = axiosResponseData.errors
  const responseCode = firstError.code

  const isBoletoApiError = responseCode.startsWith('MP')
  const isAxiosTimeoutError = responseCode === 'ECONNABORTED'

  if (isBoletoApiError || isAxiosTimeoutError) {
    const defaultBoletoApiError = {
      message: firstError.message,
      status: 'refused',
      issuer_response_code: responseCode,
    }

    return defaultBoletoApiError
  }

  const defaultErrorValue = {
    message: defaultMessageRegisterError,
    status: 'refused',
    issuer_response_code: responseCode,
  }

  return defaultErrorValue
}

const translateDefaultError = (error) => {
  if (error instanceof NotFoundParamsError) {
    const defaultErrorValue = {
      message: error.message,
      status: 'refused',
      issuer_response_code: error.code,
    }

    return defaultErrorValue
  }

  const defaultErrorValue = {
    message: defaultMessageRegisterError,
    status: 'refused',
    issuer_response_code: defaultIssuerCode,
  }

  return defaultErrorValue
}

module.exports = {
  defaultMessageRegisterError,
  translateResponseWithErrors,
  translateResponseWithoutErrors,
  translateResponseWithSuccess,
  translateDefaultError,
  NotFoundParamsError,
}
