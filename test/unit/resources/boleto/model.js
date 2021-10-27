import test from 'ava'
import {
  buildModelResponse,
  generateBoletoCode,
  validateModel,

} from '../../../../src/resources/boleto/model'

test('buildResponse', async (t) => {
  const now = new Date()

  const input = {
    id: 'bol_cizec1xk2000001nyml04gwxp',
    token: 'sandbox_cizec1xk2000001nyml04gwxp',
    queue_url: 'http://yopa/queue/test',
    status: 'issued',
    expiration_date: now,
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'bradesco',
    issuer_id: 'ciz04q0oi000001ppjf0lq4pa',
    issuer_account: '9721',
    issuer_agency: '3381',
    issuer_wallet: '26',
    payer_name: 'David Bowie',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872',
    payer_address: {
      zipcode: '5555555',
      street: 'Rua Fidêncio Ramos',
      street_number: '308',
      neighborhood: 'Vila Olímpia',
      city: 'São Paulo',
      state: 'SP',
    },
    company_name: 'Some Company',
    company_document_number: '98154524872',
    company_address: {
      zipcode: '04547006',
      street_number: '1609',
      street: 'Rua Gomes de Carvalho',
      neighborhood: 'Vila Olimpia',
      city: 'São Paulo',
      state: 'SP',
    },
    created_at: now,
    updated_at: now,
    secret_field: 'this is secret',
  }

  const output = await buildModelResponse(input)

  t.true(output.secret_field == null, 'should not have a `secret_field` prop')
  t.deepEqual(output, {
    object: 'boleto',
    id: 'bol_cizec1xk2000001nyml04gwxp',
    token: 'sandbox_cizec1xk2000001nyml04gwxp',
    queue_url: 'http://yopa/queue/test',
    status: 'issued',
    expiration_date: now,
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'bradesco',
    issuer_id: 'ciz04q0oi000001ppjf0lq4pa',
    issuer_account: '9721',
    issuer_agency: '3381',
    issuer_wallet: '26',
    payer_name: 'David Bowie',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872',
    payer_address: {
      zipcode: '5555555',
      street: 'Rua Fidêncio Ramos',
      street_number: '308',
      neighborhood: 'Vila Olímpia',
      city: 'São Paulo',
      state: 'SP',
    },
    company_name: 'Some Company',
    company_document_number: '98154524872',
    company_address: {
      zipcode: '04547006',
      street_number: '1609',
      street: 'Rua Gomes de Carvalho',
      neighborhood: 'Vila Olimpia',
      city: 'São Paulo',
      state: 'SP',
    },
    created_at: now,
    updated_at: now,
  }, 'should be a boleto object')
})

test('generateBoletoCode', (t) => {
  const input = {
    issuer: 'bradesco',
    amount: 2000,
    issuer_account: '9721',
    issuer_agency: '3381',
    issuer_wallet: '26',
    title_id: '1',
    expiration_date: new Date('2017-05-26'),
  }

  const { barcode, digitable_line } = generateBoletoCode(input) // eslint-disable-line

  t.is(barcode, '23792717100000020003381260000000000100097210')
  t.is(digitable_line, '23793.38128 60000.000004 01000.972107 2 71710000002000')
})

test('validateModel: with empty address', async (t) => {
  const boleto = {
    payer_address: {},
  }

  validateModel(boleto)

  t.deepEqual(boleto.payer_address, {
    zipcode: '04551010',
    street: 'Rua Fidêncio Ramos',
    street_number: '308',
    complementary: '9º andar, conjunto 91',
    neighborhood: 'Vila Olímpia',
    city: 'São Paulo',
    state: 'SP',
  }, 'should use default address')
})

test('validateModel: with complete address', async (t) => {
  const boleto = {
    payer_address: {
      zipcode: '01329010',
      street: 'Rua dos Franceses',
      street_number: '147',
      complementary: 'Apt 101',
      neighborhood: 'Morro dos Ingleses',
      city: 'São Paulo',
      state: 'SP',
    },
  }

  validateModel(boleto)

  t.deepEqual(boleto.payer_address, {
    zipcode: '01329010',
    street: 'Rua dos Franceses',
    street_number: '147',
    complementary: 'Apt 101',
    neighborhood: 'Morro dos Ingleses',
    city: 'São Paulo',
    state: 'SP',
  }, 'should use payer_address "as is"')
})

test('validateModel: with incomplete address', async (t) => {
  const boleto = {
    payer_address: {
      zipcode: '01329010',
      street: 'Rua dos Franceses',
      street_number: '147',
      complementary: 'Apt 101',
      neighborhood: 'Morro dos Ingleses',
      city: null,
      state: null,
    },
  }

  validateModel(boleto)

  t.deepEqual(boleto.payer_address, {
    zipcode: '04551010',
    street: 'Rua Fidêncio Ramos',
    street_number: '308',
    complementary: '9º andar, conjunto 91',
    neighborhood: 'Vila Olímpia',
    city: 'São Paulo',
    state: 'SP',
  }, 'should use default address')
})

test('validateModel: with null complementary address', async (t) => {
  const boleto = {
    payer_address: {
      zipcode: '01329010',
      street: 'Rua dos Franceses',
      street_number: '147',
      neighborhood: 'Morro dos Ingleses',
      city: 'Rio de Janeiro',
      state: 'RJ',
      complementary: null,
    },
  }

  validateModel(boleto)

  t.deepEqual(boleto.payer_address, {
    zipcode: '01329010',
    street: 'Rua dos Franceses',
    street_number: '147',
    neighborhood: 'Morro dos Ingleses',
    city: 'Rio de Janeiro',
    state: 'RJ',
    complementary: null,
  }, 'should use payer_address "as is"')
})

test('validateModel: without complementary address', async (t) => {
  const boleto = {
    payer_address: {
      zipcode: '01329010',
      street: 'Rua dos Franceses',
      street_number: '147',
      neighborhood: 'Morro dos Ingleses',
      city: 'Rio de Janeiro',
      state: 'RJ',
    },
  }

  validateModel(boleto)

  t.deepEqual(boleto.payer_address, {
    zipcode: '01329010',
    street: 'Rua dos Franceses',
    street_number: '147',
    neighborhood: 'Morro dos Ingleses',
    city: 'Rio de Janeiro',
    state: 'RJ',
  }, 'should use payer_address "as is"')
})

test('validateModel: with blank complementary address', async (t) => {
  const boleto = {
    payer_address: {
      zipcode: '01329010',
      street: 'Rua dos Franceses',
      street_number: '147',
      neighborhood: 'Morro dos Ingleses',
      city: 'Rio de Janeiro',
      state: 'RJ',
      complementary: '',
    },
  }

  validateModel(boleto)

  t.deepEqual(boleto.payer_address, {
    zipcode: '01329010',
    street: 'Rua dos Franceses',
    street_number: '147',
    neighborhood: 'Morro dos Ingleses',
    city: 'Rio de Janeiro',
    state: 'RJ',
    complementary: '',
  }, 'should use payer_address "as is"')
})
