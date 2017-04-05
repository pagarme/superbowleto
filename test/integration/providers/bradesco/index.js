import test from 'ava'
import moment from 'moment'
import { createBoleto } from '../../../functional/boleto/helpers'
import { buildHeaders, buildPayload } from '../../../../src/providers/bradesco'

let boleto

test.before(async () => {
  boleto = await createBoleto()
})

test('buildHeaders', (t) => {
  const headers = buildHeaders()

  t.deepEqual(headers, {
    Authorization: 'Basic MTAwMDA1MjU0OmJiRTlYTjhSaE95QTktNzlISFBuYkoxLVFxeTdrem9LR2RSLU5qbWk5Zmc='
  })
})

test('buildPayload', async (t) => {
  const payload = buildPayload(boleto)

  t.deepEqual(payload, {
    merchant_id: '100005254',
    boleto: {
      carteira: '25',
      nosso_numero: boleto.title_id,
      numero_documento: boleto.title_id,
      data_emissao: moment(boleto.created_at).format('YYYY-MM-DD'),
      data_vencimento: moment(boleto.expiration_date).format('YYYY-MM-DD'),
      valor_titulo: 2000,
      pagador: {
        nome: 'David Bowie',
        documento: '98154524872',
        tipo_documento: '1',
        endereco: {
          cep: '05420000',
          logradouro: 'Avenida Pedroso de Morais',
          numero: '142',
          complemento: 'Ap 201',
          bairro: 'Pinheiros',
          cidade: 'São Paulo',
          uf: 'SP'
        }
      }
    }
  })
})
