import axios from 'axios'
import * as Promise from 'bluebird'
import { always, compose, prop, applySpec } from 'ramda'
import { format } from './formatter'
import getConfig from '../../config/providers'
import { encodeBase64 } from '../../lib/encoding'
import { makeFromLogger } from '../../lib/logger'

const { endpoint, merchantId, securityKey } = prop('bradesco', getConfig())

const makeLogger = makeFromLogger('bradesco/index')

export const buildHeaders = () => {
  const authorization = encodeBase64(`${merchantId}:${securityKey}`)

  return {
    Authorization: `Basic ${authorization}`
  }
}

export const buildPayload = applySpec({
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
})

export const register = (boleto) => {
  const request = {
    url: endpoint,
    method: 'POST',
    headers: buildHeaders(),
    data: buildPayload(boleto)
  }

  const logger = makeLogger({ operation: 'register' })

  logger.info({ status: 'started', metadata: { request } })

  return Promise.resolve(request)
    .then(axios.request)
    .tap((response) => {
      logger.info({ status: 'succeeded', metadata: { status: response.status, data: response.data } })
    })
    .catch((err) => {
      logger.error({ status: 'failed', metadata: { err } })
      throw err
    })
}

export const verifyRegistrationStatus = (boleto) => {
  const request = {
    url: `${endpoint}`,
    headers: buildHeaders(),
    method: 'GET',
    params: {
      nosso_numero: prop('issuer_id', boleto),
      numero_documento: prop('title_id', boleto)
    }
  }

  const logger = makeLogger({ operation: 'verifyRegistrationStatus' })

  logger.info({ status: 'started', metadata: { request } })

  return Promise.resolve(request)
    .then(axios.request)
    .tap((response) => {
      logger.info({ status: 'succeeded', metadata: { status: response.status, data: response.data } })
    })
    .catch((err) => {
      logger.error({ status: 'failed', metadata: { err } })
      throw err
    })
}
