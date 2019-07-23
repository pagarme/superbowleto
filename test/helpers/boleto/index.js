import sinon from 'sinon'
import { Queue } from 'sqs-quooler'
import sqs from '../../../src/lib/sqs'
import database from '../../../src/database'
import { buildModelResponse } from '../../../src/resources/boleto/model'

const { Boleto } = database.models

export const userQueueUrl = `http://${process.env.SQS_HOST || 'yopa'}:47195/queue/test`

export const mock = {
  expiration_date: new Date(),
  amount: 2000,
  instructions: 'Please do not accept after expiration_date',
  issuer: 'bradesco',
  issuer_account: '9721',
  issuer_agency: '3381',
  issuer_wallet: '26',
  payer_name: 'David Bowie',
  payer_document_type: 'cpf',
  payer_document_number: '98154524872',
  payer_address: {
    zipcode: '5555555',
    street_number: '308',
    complementary: '11º andar',
    neighborhood: 'Brooklin',
    city: 'São Paulo',
    state: 'SP',
  },
  queue_url: userQueueUrl,
  company_name: 'Some Company',
  company_document_number: '98154524872',
  company_address: {
    zipcode: '04547006',
    street_number: '1609',
    street: 'Rua Gomes de Carvalho',
    complementary: '6º andar',
    neighborhood: 'Vila Olimpia',
    city: 'São Paulo',
    state: 'SP',
  },
  interest: {
    amount: 100,
    days: 7,
  },
  fine: {
    amount: 85,
    days: 3,
  },
}

export const createBoleto = (data = {}) => {
  const payload = Object.assign({}, mock, data)

  return Boleto.create(payload)
    .then(buildModelResponse)
}

export const restoreFunction = (obj, name) => {
  if (obj[name].restore) {
    obj[name].restore()
  }
}

export const mockFunction = (obj, name, fn) => {
  restoreFunction(obj, name)
  sinon.stub(obj, name).callsFake(fn)
}

export const userQueue = new Queue({
  sqs,
  endpoint: userQueueUrl,
})
