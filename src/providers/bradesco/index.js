const axios = require('axios')
const moment = require('moment')
const Promise = require('bluebird')
const {
  always,
  applySpec,
  assoc,
  both,
  complement,
  compose,
  defaultTo,
  equals,
  ifElse,
  isNil,
  length,
  multiply,
  path,
  pathOr,
  pipe,
  prop,
  propSatisfies,
  toLower,
  toString,
  toUpper,
  trim,
} = require('ramda')
const { format } = require('./formatter')
const config = require('../../config/providers')
const { encodeBase64 } = require('../../lib/encoding')
const { makeFromLogger } = require('../../lib/logger')
const responseCodeMap = require('./response-codes')
const brazilianStates = require('../../lib/helpers/brazilian-states')
const { getRequestTimeoutMs } = require('../../lib/http/request')

const {
  api_key: apiKey,
  endpoint,
  merchant_id: merchantId,
} = prop('bradesco', config)

const makeLogger = makeFromLogger('bradesco/index')

const buildHeaders = () => {
  const authorization = encodeBase64(`${merchantId}:${apiKey}`)

  return {
    Authorization: `Basic ${authorization}`,
  }
}

const isNotNil = complement(isNil)

const isNumber = both(
  isNotNil,
  complement(isNaN) // eslint-disable-line no-restricted-globals
)

const isLengthEquals = numberOfCharacters => pipe(
  length,
  equals(numberOfCharacters)
)

const normalizePercentage = ifElse(
  isNumber,
  pipe(
    percentage => Number(percentage).toFixed(5),
    multiply(100000),
    parseInt,
    toString,
    percentage => percentage.padStart(8, '0')
  ),
  always(undefined)
)

const buildPayload = (boleto) => {
  const spec = applySpec({
    merchant_id: always(merchantId),
    boleto: {
      carteira: pathOr('26', ['issuer_wallet']),
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
          uf: pipe(
            path(['payer_address', 'state']),
            toLower,
            trim,
            state => brazilianStates[state] || state,
            toUpper
          ),
        },
      },
      informacoes_opcionais: {
        perc_juros: pipe(
          path(['interest', 'percentage']),
          normalizePercentage
        ),
        valor_juros: path(['interest', 'amount']),
        qtde_dias_juros: path(['interest', 'days']),

        perc_multa_atraso: pipe(
          path(['fine', 'percentage']),
          normalizePercentage
        ),
        valor_multa_atraso: path(['fine', 'amount']),
        qtde_dias_multa_atraso: path(['fine', 'days']),

        sacador_avalista: {
          nome: prop('company_name'),
          documento: prop('company_document_number'),
          tipo_documento: ifElse(
            propSatisfies(
              isLengthEquals(11),
              'company_document_number'
            ),
            always('1'),
            always('2')
          ),
          endereco: {
            cep: path(['company_address', 'zipcode']),
            logradouro: path(['company_address', 'street']),
            numero: path(['company_address', 'street_number']),
            complemento: path(['company_address', 'complementary']),
            bairro: path(['company_address', 'neighborhood']),
            cidade: path(['company_address', 'city']),
            uf: pipe(
              path(['company_address', 'state']),
              toLower,
              trim,
              state => brazilianStates[state] || state,
              toUpper
            ),
          },
        },
      },
    },
  })

  return spec(boleto)
}

const translateResponseCode = (response) => {
  const responseCode = response.data.status.codigo.toString()

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
  operationId: `req_${Date.now()}`,
}

const getProvider = ({ operationId } = defaultOptions) => {
  const register = (boleto) => {
    const logger = makeLogger(
      {
        operation: 'register_boleto_on_provider',
        provider: 'bradesco',
      },
      { id: operationId }
    )

    const headers = buildHeaders()
    const payload = buildPayload(boleto)
    const timeoutMs = getRequestTimeoutMs(10000)

    return Promise.resolve({
      headers,
      data: payload,
      url: endpoint,
      method: 'POST',
      timeout: timeoutMs,
    })
      .tap((request) => {
        logger.info({
          status: 'started',
          metadata: {
            request: { body: request.data },
          },
        })
      })
      .then(axios.request)
      .tap(response => logger.info({
        metadata: {
          response: response.data,
        },
      }))
      .then(translateResponseCode)
      .tap((response) => {
        logger.info({
          status: 'success',
          metadata: { status: response.status, data: response.data },
        })
      })
      .tapCatch(err => logger.error({
        status: 'failed',
        metadata: {
          error_name: err.name,
          error_stack: err.stack,
          error_message: err.message,
        },
      }))
  }

  return {
    register,
  }
}

module.exports = {
  buildHeaders,
  buildPayload,
  normalizePercentage,
  translateResponseCode,
  getProvider,
}
