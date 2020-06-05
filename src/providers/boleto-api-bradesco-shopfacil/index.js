const axios = require('axios')
const Promise = require('bluebird')
const cuid = require('cuid')
const {
  assoc,
  defaultTo,
  path,
  prop,
} = require('ramda')
const config = require('../../config/providers')
const responseCodeMap = require('./response-codes')
const { encodeBase64 } = require('../../lib/encoding')
const { makeFromLogger } = require('../../lib/logger')
const { isA4XXError } = require('../../lib/helpers/errors')
const {
  formatDate,
  getDocumentType,
  formatStateCode,
} = require('./formatter')

const {
  boleto_api_password: boletoApiPassword,
  boleto_api_user: boletoApiUser,
  username,
  password,
  endpoint,
} = prop('boleto-api-bradesco-shopfacil', config)

const makeLogger = makeFromLogger('boleto-api-bradesco-shopfacil/index')

const bradescoBankCode = 237

const buildHeaders = () => {
  const authorization = encodeBase64(`${boletoApiUser}:${boletoApiPassword}`)

  return {
    Authorization: `Basic ${authorization}`,
  }
}

const buildPayload = (boleto, operationId) => {
  const formattedExpirationDate = formatDate(boleto.expiration_date)

  const formattedBuyerStateCode = formatStateCode(boleto, 'payer_address')

  const formattedRecipientStateCode = formatStateCode(boleto, 'company_address')

  const recipientDocumentType = getDocumentType(path(['company_document_number'], boleto))

  const fakeTemporaryAgreementNumber = 3069995

  const payload = {
    bankNumber: bradescoBankCode,
    authentication: {
      username,
      password,
    },
    agreement: {
      agreementNumber: fakeTemporaryAgreementNumber,
      wallet: parseInt(path(['issuer_wallet'], boleto), 10),
      agency: path(['issuer_agency'], boleto),
      account: path(['issuer_account'], boleto),
    },
    title: {
      expireDate: formattedExpirationDate,
      amountInCents: path(['amount'], boleto),
      ourNumber: path(['title_id'], boleto),
      instructions: path(['instructions'], boleto),
      documentNumber: String(path(['title_id'], boleto)),
    },
    recipient: {
      name: path(['company_name'], boleto),
      document: {
        type: recipientDocumentType,
        number: path(['company_document_number'], boleto),
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
        type: path(['payer_document_type'], boleto),
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
  const axiosPayload = {
    data: payload,
    url: endpoint,
    method: 'POST',
    headers,
  }

  try {
    const response = await axios.request(axiosPayload)

    return response.data
  } catch (error) {
    if (error && error.response && isA4XXError(error)) {
      return error.response
    }

    throw error
  }
}

const translateResponseCode = (axiosResponseData) => {
  if (!axiosResponseData.errors) {
    const defaultSuccessValue = {
      message: 'Registro efetuado com sucesso - CIP CONFIRMADA',
      status: 'registered',
      issuer_response_code: '93005119',
    }

    return defaultSuccessValue
  }

  const firstError = axiosResponseData.errors[0]
  const responseCode = firstError.code

  if (responseCode.substring(0, 2) === 'MP') {
    const defaultMundipaggError = {
      message: firstError.message,
      status: 'refused',
      issuer_response_code: responseCode,
    }

    return defaultMundipaggError
  }

  const defaultValue = {
    message: 'CÓDIGO INEXISTENTE',
    status: 'unknown',
  }

  return assoc(
    'issuer_response_code',
    responseCode,
    defaultTo(defaultValue, prop(responseCode, responseCodeMap))
  )
}

const defaultOptions = {
  operationId: `req_${Date.now()}${cuid()}`,
}

const getProvider = ({ operationId } = defaultOptions) => {
  const register = async (boleto) => {
    const logger = makeLogger(
      {
        operation: 'register_boleto_on_provider',
        provider: 'boleto-api-bradesco-shopfacil',
      },
      { id: operationId }
    )

    try {
      const headers = buildHeaders()
      logger.info({ // TODO remover
        headers,
      })

      const payload = buildPayload(boleto, operationId)
      logger.info({ // TODO remover
        payload,
      })

      const responseData = await sendRequestToBoletoApi(payload, headers)
      logger.info({ // TODO remover
        responseData,
      })

      const translatedResponse = translateResponseCode(responseData)
      logger.info({ // TODO remover
        translatedResponse,
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
}
