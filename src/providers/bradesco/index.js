import axios from 'axios'
import { always, compose, prop } from 'ramda'
import { format, formatWithTemplate } from './formatter'
import getConfig from '../../config/providers'
import { encodeBase64 } from '../../lib/encoding'

const { endpoint, merchantId, securityKey } = prop('bradesco', getConfig())

export const buildHeaders = () => {
  const authorization = encodeBase64(`${merchantId}:${securityKey}`)

  return {
    Authorization: `Basic ${authorization}`
  }
}

export const buildPayload = formatWithTemplate({
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
        cep: always('05420000'),
        logradouro: always('Avenida Pedroso de Morais'),
        numero: always('142'),
        complemento: always('Ap 201'),
        bairro: always('Pinheiros'),
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

  return Promise.resolve(request)
    .then(axios.request)
}
