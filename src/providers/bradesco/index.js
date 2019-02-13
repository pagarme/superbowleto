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
  prop,
} = require('ramda')
const { format } = require('./formatter')
const config = require('../../config/providers')
const { encodeBase64 } = require('../../lib/encoding')
const { makeFromLogger } = require('../../lib/logger')
const responseCodeMap = require('./response-codes')

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

const buildPayload = (boleto) => {
  const spec = applySpec({
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
          uf: path(['payer_address', 'state']),
        },
      },
      informacoes_opcionais: {
        perc_juros: defaultTo(null, path(['interest', 'percentage'])),
        valor_juros: defaultTo(null, path(['interest', 'amount'])),
        qtde_dias_juros: path(['interest', 'days']),

        perc_multa_atraso: defaultTo(null, path(['fine', 'percentage'])),
        valor_multa_atraso: defaultTo(null, path(['fine', 'amount'])),
        qtde_dias_multa_atraso: path(['fine', 'days']),

        perc_desconto_1: defaultTo(null, path(['discount', '0', 'percentage'])),
        valor_desconto_1: defaultTo(null, path(['discount', '0', 'amount'])),
        data_limite_desconto_1: path(['discount', '0', 'limit_date']),

        perc_desconto_2: defaultTo(null, path(['discount', '1', 'percentage'])),
        valor_desconto_2: defaultTo(null, path(['discount', '1', 'amount'])),
        data_limite_desconto_2: path(['discount', '1', 'limit_date']),

        perc_desconto_3: defaultTo(null, path(['discount', '2', 'percentage'])),
        valor_desconto_3: defaultTo(null, path(['discount', '2', 'amount'])),
        data_limite_desconto_3: path(['discount', '2', 'limit_date']),

        sacador_avalista: {
          nome: prop('company_name'),
          documento: prop('company_document_number'),
          tipo_documento: always('2'),
          endereco: {
            cep: path(['company_address', 'zipcode']),
            logradouro: path(['company_address', 'street']),
            numero: path(['company_address', 'street_number']),
            complemento: path(['company_address', 'complementary']),
            bairro: path(['company_address', 'neighborhood']),
            cidade: path(['company_address', 'city']),
            uf: path(['company_address', 'state']),
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

    return Promise.resolve({
      headers,
      data: payload,
      url: endpoint,
      method: 'POST',
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
  translateResponseCode,
  getProvider,
}
