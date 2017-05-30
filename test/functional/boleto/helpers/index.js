import sinon from 'sinon'

import { models } from '../../../../src/database'

const { Boleto } = models

export const mock = {
  expiration_date: new Date(),
  amount: 2000,
  instructions: 'Please do not accept after expiration_date',
  issuer: 'bradesco',
  payer_name: 'David Bowie',
  payer_document_type: 'cpf',
  payer_document_number: '98154524872',
  queue_url: 'http://yopa/queue/test'
}

export const createBoleto = (data = {}) => {
  const payload = Object.assign({}, mock, data)

  return Boleto.create(payload)
    .then(Boleto.buildResponse)
}

export const restoreFunction = (obj, name) => {
  if (obj[name].restore) {
    obj[name].restore()
  }
}

// Wrap function if it isn't already wrapped (ava runs concurrently)
export const mockFunction = (obj, name, fn) => {
  restoreFunction(obj, name)
  sinon.stub(obj, name).callsFake(fn)
}
