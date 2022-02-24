const axios = require('axios')
const Promise = require('bluebird')
const cuid = require('cuid')
const {
  path,
  prop,
  find,
  propEq,
  pipe,
  pathOr,
} = require('ramda')

const { encodeBase64 } = require('../../lib/encoding')
const { makeFromLogger } = require('../../lib/logger')
const { isA4XXError } = require('../../lib/helpers/errors')
const {
  formatDate,
  formatStateCode,
} = require('./formatter')

const config = require('../../config/providers')

const {
  boleto_api_password: boletoApiPassword,
  boleto_api_user: boletoApiUser,
  endpoint,
} = prop('boleto-api-caixa', config)

const makeLogger = makeFromLogger('boleto-api-caixa/index')

const caixaBankCode = 104
const agreementNumber = 1103388
const agency = '3337'
const recipientDocumentNumber = '18727053000174'
const recipientDocumentType = 'CNPJ'
const defaultValueFee = 0
const numberOfStandardDays = 0

const buildHeaders = () => {
  const authorization = encodeBase64(`${boletoApiUser}:${boletoApiPassword}`)

  return {
    Authorization: `Basic ${authorization}`,
  }
}

const noStrictRules = {
  acceptDivergentAmount: true,
  maxDaysToPayPastDue: 60,
}

const strictExpirateDateRules = {
  acceptDivergentAmount: false,
  maxDaysToPayPastDue: 1,
}

const defineRules = (boleto) => {
  if (boleto.rules) {
    if (boleto.rules.includes('strict_expiration_date')) {
      return strictExpirateDateRules
    }
    if (boleto.rules.includes('no_strict')) {
      return noStrictRules
    }
  }

  if (boleto.issuer_wallet === '25') {
    return strictExpirateDateRules
  }

  if (boleto.issuer_wallet === '26') {
    return noStrictRules
  }

  return null
}

const getInstructions = (companyName, boleto) => {
  let instructions = path(['instructions'], boleto) || ''

  instructions += ` A emissão deste boleto foi solicitada e/ou intermediada pela empresa ${companyName} - CNPJ: ${recipientDocumentNumber}. Para confirmar a existência deste boleto consulte em pagar.me/boletos.`

  return instructions
}

const buildPayload = (boleto, operationId) => {
  const formattedExpirationDate = formatDate(boleto.expiration_date)
  const formattedRecipientStateCode = formatStateCode(boleto, 'company_address')
  const formattedBuyerStateCode = formatStateCode(boleto, 'payer_address')
  const companyName = path(['company_name'], boleto)

  const instructions = getInstructions(companyName, boleto)

  const payload = {
    bankNumber: caixaBankCode,
    agreement: {
      agreementNumber,
      agency,
    },
    title: {
      expireDate: formattedExpirationDate,
      amountInCents: path(['amount'], boleto),
      ourNumber: path(['title_id'], boleto),
      instructions,
      documentNumber: String(path(['title_id'], boleto)),
      rules: defineRules(boleto),
      fees: {
        fine: {
          daysAfterExpirationDate: pathOr(numberOfStandardDays, ['fine', 'days'], boleto),
          amountInCents: pathOr(defaultValueFee, ['fine', 'amount'], boleto),
          percentageOnTotal: pathOr(defaultValueFee, ['fine', 'percentage'], boleto),
        },
        interest: {
          daysAfterExpirationDate: pathOr(numberOfStandardDays, ['interest', 'days'], boleto),
          amountPerDayInCents: pathOr(defaultValueFee, ['interest', 'amount'], boleto),
          percentagePerMonth: pathOr(defaultValueFee, ['interest', 'percentage'], boleto),
        },
      },
    },
    recipient: {
      name: `${companyName} | Pagar.me Pagamentos S/A`,
      document: {
        type: recipientDocumentType,
        number: recipientDocumentNumber,
      },
      address: {
        street: path(['company_address', 'street'], boleto),
        number: path(['company_address', 'street_number'], boleto),
        complement: path(['company_address', 'complementary'], boleto),
        zipCode: path(['company_address', 'zipcode'], boleto),
        district: path(['company_address', 'neighborhood'], boleto),
        city: path(['company_address', 'city'], boleto),
        stateCode: formattedRecipientStateCode,
      },
    },
    buyer: {
      name: path(['payer_name'], boleto),
      document: {
        number: path(['payer_document_number'], boleto),
        type: path(['payer_document_type'], boleto).toUpperCase(),
      },
      address: {
        street: path(['payer_address', 'street'], boleto),
        number: path(['payer_address', 'street_number'], boleto),
        complement: path(['payer_address', 'complementary'], boleto),
        district: path(['payer_address', 'neighborhood'], boleto),
        zipCode: path(['payer_address', 'zipcode'], boleto),
        city: path(['payer_address', 'city'], boleto),
        stateCode: formattedBuyerStateCode,
      },
    },
    requestKey: operationId,
  }

  return payload
}

const sendRequestToBoletoApi = async (payload, headers) => {
  const timeoutMs = process.env.APP_ENV === 'prd' ? 50000 : 25000

  const axiosPayload = {
    data: payload,
    url: endpoint,
    method: 'POST',
    headers,
    timeout: timeoutMs,
  }

  try {
    const response = await axios.request(axiosPayload)

    return response
  } catch (error) {
    if (error && error.response && isA4XXError(error)) {
      return error.response
    }

    throw error
  }
}

const isHtml = propEq('rel', 'html')

const getBoletoUrl = pipe(
  prop('links'),
  find(isHtml),
  path(['href'])
)

const translateResponseCode = (axiosResponse) => {
  const axiosResponseData = path(['data'], axiosResponse)
  const hasErrors = path(['errors', 'length'], axiosResponseData)

  if (!hasErrors) {
    const boletoUrl = getBoletoUrl(axiosResponseData)
    const digitableLine = path(['digitableLine'], axiosResponseData)
    const barcode = path(['barCodeNumber'], axiosResponseData)

    if (!boletoUrl) {
      throw new Error('URL do boleto não existe')
    }

    if (!digitableLine) {
      throw new Error('linha digitável do boleto não existe')
    }

    if (!barcode) {
      throw new Error('código de barras do boleto não existe')
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

  const firstError = axiosResponseData.errors[0]
  const responseCode = firstError.code

  if (responseCode.substring(0, 2) === 'MP') {
    const defaultBoletoApiError = {
      message: firstError.message,
      status: 'refused',
      issuer_response_code: responseCode,
    }

    return defaultBoletoApiError
  }

  const defaultErroredValue = {
    message: 'Register operation failed at Caixa',
    status: 'refused',
    issuer_response_code: 'defaultErrorCode',
  }

  return defaultErroredValue
}

const defaultOptions = {
  operationId: `req_${Date.now()}${cuid()}`,
}

const getProvider = ({ operationId } = defaultOptions) => {
  const register = async (boleto) => {
    const logger = makeLogger(
      {
        operation: 'register_boleto_on_provider',
        provider: 'boleto-api-caixa',
      },
      { id: operationId }
    )

    try {
      const headers = buildHeaders()

      const payload = buildPayload(boleto, operationId)

      logger.info({
        status: 'started',
        metadata: {
          request: {
            body: payload,
          },
        },
      })

      const response = await sendRequestToBoletoApi(payload, headers)

      const translatedResponse = translateResponseCode(response)

      logger.info({
        status: 'success',
        metadata: {
          statusCode: response.status,
          data: response.data,
          status: translatedResponse.status,
          message: translatedResponse.message,
        },
      })

      return Promise.resolve(translatedResponse)
    } catch (error) {
      logger.error({
        status: 'failed',
        metadata: {
          error_name: error.name,
          error_stack: error.stack,
          error_message: error.message,
        },
      })

      throw error
    }
  }

  return {
    register,
  }
}

module.exports = {
  buildHeaders,
  buildPayload,
  getProvider,
  translateResponseCode,
  isHtml,
  getBoletoUrl,
}
