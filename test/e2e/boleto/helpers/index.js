import { models } from '../../../../src/database'
import { createQueue } from '../../queue/helpers'

const { Boleto } = models

export const boletoMock = {
  status: 'pending_registration',
  expiration_date: new Date(),
  amount: 2000,
  instructions: 'Please do not accept after expiration_date',
  issuer: 'bradesco',
  issuer_id: 'ciz04q0oi000001ppjf0lq4pa',
  payer_name: 'John Appleseed',
  payer_document_type: 'cpf',
  payer_document_number: '98154524872'
}

export const createBoleto = (data = boletoMock) =>
  createQueue()
    .then((queue) => {
      const payload = Object.assign({}, data, {
        queue_id: queue.id
      })

      return Boleto.create(payload)
    })
    .then(Boleto.buildResponse)
