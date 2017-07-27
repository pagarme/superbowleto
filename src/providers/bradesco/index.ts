import axios from 'axios'
import * as Promise from 'bluebird'
import { always, applySpec, compose, defaultTo, prop } from 'ramda'
import { format } from './formatter'
import getConfig from '../../config/providers'
import { encodeBase64 } from '../../lib/encoding'
import { makeFromLogger } from '../../lib/logger'
import { getCredentials } from '../../lib/credentials'
import responseCodeMap from './response-codes'

const { endpoint } = prop('bradesco', getConfig())

const makeLogger = makeFromLogger('bradesco/index')

export const buildHeaders = () =>
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


export const buildPayload = boleto =>
  Promise.resolve(getCredentials('providers/bradesco/company_id'))
    .then(merchantId => ({
      merchant_id: always(merchantId),
      boleto: {
        carteira: always('25'),
        nosso_numero: prop('title_id'),
        numero_documento: prop('title_id'),
        data_emissao: compose(format('date'), prop('created_at')),
        data_vencimento: compose(format('date'), prop('expiration_date')),
        valor_titulo: prop('amount'),
        pagador: {
          nome: prop('payer_name'),
          documento: prop('payer_document_number'),
          tipo_documento: compose(format('documentType'), prop('payer_document_type')),
          endereco: {
            cep: always('04551010'),
            logradouro: always('Rua Fidêncio Ramos'),
            numero: always('308'),
            complemento: always('9º andar, conjunto 91'),
            bairro: always('Vila Olímpia'),
            cidade: always('São Paulo'),
            uf: always('SP')
          }
        }
      }
    }))
    .then(spec => applySpec(spec)(boleto))

export const translateResponseCode = (response) => {
  const logger = makeLogger({ operation: 'translateResponseCode' })

  const responseCode = response.data.status.codigo.toString()

  logger.info({ status: 'succeeded', metadata: { providerResponse: response.toString() } })

  const defaultValue = {
    message: 'CÓDIGO INEXISTENTE',
    status: 'unknown'
  }

  return defaultTo(defaultValue, prop(responseCode, responseCodeMap))
}

export const verifyRegistrationStatus = (boleto) => {
  const logger = makeLogger({ operation: 'verifyRegistrationStatus' })

  return Promise.resolve(buildHeaders())
    .then(headers => ({
      headers,
      url: `${endpoint}`,
      method: 'GET',
      params: {
        nosso_numero: prop('issuer_id', boleto),
        numero_documento: prop('title_id', boleto)
      }
    }))
    .tap((request) => {
      logger.info({ status: 'started', metadata: { request } })
    })
    .then(axios.request)
    .then(translateResponseCode)
    .tap((response) => {
      logger.info({ status: 'succeeded', metadata: { status: response.status, data: response.data } })
    })
    .tapCatch(err => logger.error({ status: 'failed', metadata: { err } }))
}

export const register = (boleto) => {
  const logger = makeLogger({ operation: 'register' })

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
      logger.info({ status: 'started', metadata: { request } })
    })
    .then(axios.request)
    .then(translateResponseCode)
    .then((translatedResponseCode) => {
      if (translatedResponseCode.status === 'check_status') {
        return verifyRegistrationStatus(boleto)
      }

      return translatedResponseCode
    })
    .tap((response) => {
      logger.info({ status: 'succeeded', metadata: { status: response.status, data: response.data } })
    })
    .tapCatch(err => logger.error({ status: 'failed', metadata: { err } }))
}
