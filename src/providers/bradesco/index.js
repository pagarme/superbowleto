const axios = require('axios')
const moment = require('moment')
const Promise = require('bluebird')
const {
  always,
  applySpec,
  assoc,
  compose,
  defaultTo,
  path,
  pathOr,
  prop
} = require('ramda')
const { format } = require('./formatter')
const getConfig = require('../../config/providers')
const { encodeBase64 } = require('../../lib/encoding')
const { makeFromLogger } = require('../../lib/logger')
const { getCredentials } = require('../../lib/credentials')
const responseCodeMap = require('./response-codes')

const { endpoint } = prop('bradesco', getConfig())

const makeLogger = makeFromLogger('bradesco/index')

const buildHeaders = () =>
  Promise.all([
    getCredentials('providers/bradesco/company_id'),
    getCredentials('providers/bradesco/api_key')
  ])
    .spread((merchantId, securityKey) => {
      const authorization = encodeBase64(`${merchantId}:${securityKey}`)

      return {
        Authorization: `Basic ${authorization}`
      }
    })

const buildPayload = boleto =>
  Promise.resolve(getCredentials('providers/bradesco/company_id'))
    .then(merchantId => ({
      merchant_id: always(merchantId),
      boleto: {
        carteira: always('26'),
        nosso_numero: prop('title_id'),
        numero_documento: prop('title_id'),
        data_emissao: compose(format('date'), always(moment().toDate())),
        data_vencimento: compose(format('date'), prop('expiration_date')),
        valor_titulo: prop('amount'),
        pagador: {
          nome: prop('payer_name'),
          documento: prop('payer_document_number'),
          tipo_documento: compose(format('documentType'), prop('payer_document_type')),
          endereco: {
            cep: path(['payer_address', 'zipcode']),
            logradouro: path(['payer_address', 'street']),
            numero: path(['payer_address', 'street_number']),
            complemento: path(['payer_address', 'complementary']),
            bairro: path(['payer_address', 'neighborhood']),
            cidade: path(['payer_address', 'city']),
            uf: path(['payer_address', 'state'])
          }
        }
      }
    }))
    .then(spec => applySpec(spec)(boleto))

const translateResponseCode = (response) => {
  const responseCode = response.data.status.codigo.toString()

  const defaultValue = {
    message: 'CÓDIGO INEXISTENTE',
    status: 'unknown'
  }

  return assoc(
    'issuer_response_code',
    responseCode,
    defaultTo(defaultValue, prop(responseCode, responseCodeMap))
  )
}

const defaultOptions = {
  requestId: `req_${Date.now()}`
}

const getProvider = ({ requestId } = defaultOptions) => {
  const register = (boleto) => {
    const logger = makeLogger(
      {
        operation: 'register_boleto_on_provider',
        provider: 'bradesco'
      },
      { id: requestId }
    )

    return Promise.all([
      buildHeaders(),
      buildPayload(boleto)
    ])
      .spread((headers, payload) => ({
        headers,
        data: payload,
        url: endpoint,
        method: 'POST'
      }))
      .tap((request) => {
        logger.info({
          status: 'started',
          metadata: {
            request: { body: request.data }
          }
        })
      })
      .then(axios.request)
      .tap(response => logger.info({
        metadata: {
          response: response.data
        }
      }))
      .then(translateResponseCode)
      .tap((response) => {
        logger.info({
          status: 'success',
          metadata: { status: response.status, data: response.data }
        })
      })
      .tapCatch(err => logger.error({
        status: 'failed',
        metadata: {
          error_name: err.name,
          error_stack: err.stack,
          error_message: err.message
        }
      }))
  }

  return {
    register
  }
}

module.exports = {
  buildHeaders,
  buildPayload,
  translateResponseCode,
  getProvider
}
