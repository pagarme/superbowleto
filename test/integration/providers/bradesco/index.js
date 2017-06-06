import test from 'ava'
import moment from 'moment'
import { createBoleto } from '../../../helpers/boleto'
import { buildHeaders, buildPayload, register, verifyRegistrationStatus } from '../../../../build/providers/bradesco'

test('buildHeaders', (t) => {
  const headers = buildHeaders()

  t.deepEqual(headers, {
    Authorization: 'Basic MTAwMDA1MjU0OmJiRTlYTjhSaE95QTktNzlISFBuYkoxLVFxeTdrem9LR2RSLU5qbWk5Zmc='
  })
})

test('buildPayload', async (t) => {
  const boleto = await createBoleto()
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
          cep: '04551010',
          logradouro: 'Rua Fidêncio Ramos',
          numero: '308',
          complemento: '9º andar, conjunto 91',
          bairro: 'Vila Olímpia',
          cidade: 'São Paulo',
          uf: 'SP'
        }
      }
    }
  })
})

test('register', async (t) => {
  const boleto = await createBoleto()

  const response = await register(boleto)

  t.is(response.status, 201)
  t.is(response.data.boleto.nosso_numero, boleto.title_id)
  t.is(response.data.boleto.numero_documento, `${boleto.title_id}`)
})

test('verifyRegistrationStatus', async (t) => {
  const boleto = await createBoleto()
  boleto.issuer_id = boleto.title_id

  await register(boleto)

  const response = await verifyRegistrationStatus(boleto)

  t.is(response.status, 200)
  t.is(response.data.boleto.nosso_numero, boleto.issuer_id)
  t.is(response.data.boleto.numero_documento, `${boleto.title_id}`)
})
