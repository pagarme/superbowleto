import test from 'ava'
import moment from 'moment'
import cuid from 'cuid'
import { createBoleto } from '../../../helpers/boleto'
import {
  buildHeaders,
  buildPayload,
  translateResponseCode,
} from '../../../../src/providers/boleto-api-caixa'
import {
  getDocumentType,
} from '../../../../src/providers/boleto-api-caixa/formatter'

test('buildPayload with full payer_address', async (t) => {
  const boleto = await createBoleto({
    payer_address: {
      zipcode: '5555555',
      street_number: '308',
      complementary: '11º andar',
      neighborhood: 'Brooklin',
      city: 'São Paulo',
      state: 'SP',
      street: 'lalalalalalal',
    },
  })

  const operationId = cuid()

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload, {
    bankNumber: 104,
    agreement: {
      agreementNumber: 1103388,
      agency: boleto.issuer_agency,
    },
    title: {
      expireDate: moment(boleto.expiration_date).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
      amountInCents: boleto.amount,
      ourNumber: boleto.title_id,
      instructions: boleto.instructions,
      documentNumber: String(boleto.title_id),
    },
    recipient: {
      name: boleto.company_name,
      document: {
        type: getDocumentType(boleto.company_document_number),
        number: boleto.company_document_number,
      },
      address: {
        street: boleto.company_address.street,
        number: boleto.company_address.street_number,
        complement: boleto.company_address.complementary,
        zipCode: boleto.company_address.zipcode,
        district: boleto.company_address.neighborhood,
        city: boleto.company_address.city,
        stateCode: boleto.company_address.state,
      },
    },
    buyer: {
      name: boleto.payer_name,
      document: {
        type: boleto.payer_document_type.toUpperCase(),
        number: boleto.payer_document_number,
      },
      address: {
        street: boleto.payer_address.street,
        number: boleto.payer_address.street_number,
        complement: boleto.payer_address.complementary,
        district: boleto.payer_address.neighborhood,
        zipCode: boleto.payer_address.zipcode,
        city: boleto.payer_address.city,
        stateCode: boleto.payer_address.state,
      },
    },
    requestKey: operationId,
  })
})

test('buildPayload with payer_address incomplete', async (t) => {
  const operationId = cuid()
  const boleto = await createBoleto()
  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload, {
    bankNumber: 104,
    agreement: {
      agreementNumber: 1103388,
      agency: boleto.issuer_agency,
    },
    title: {
      expireDate: moment(boleto.expiration_date).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
      amountInCents: boleto.amount,
      ourNumber: boleto.title_id,
      instructions: boleto.instructions,
      documentNumber: String(boleto.title_id),
    },
    recipient: {
      name: boleto.company_name,
      document: {
        type: getDocumentType(boleto.company_document_number),
        number: boleto.company_document_number,
      },
      address: {
        street: boleto.company_address.street,
        number: boleto.company_address.street_number,
        complement: boleto.company_address.complementary,
        zipCode: boleto.company_address.zipcode,
        district: boleto.company_address.neighborhood,
        city: boleto.company_address.city,
        stateCode: boleto.company_address.state,
      },
    },
    buyer: {
      name: boleto.payer_name,
      document: {
        type: boleto.payer_document_type.toUpperCase(),
        number: boleto.payer_document_number,
      },
      address: {
        street: 'Rua Fidêncio Ramos',
        number: '308',
        complement: '9º andar, conjunto 91',
        zipCode: '04551010',
        district: 'Vila Olímpia',
        city: 'São Paulo',
        stateCode: 'SP',
      },
    },
    requestKey: operationId,
  })
})

test('translateResponseCode: with a "registered" code', (t) => {
  const axiosResponse = {
    data: {
      id: '37279202382',
      digitableLine: '98139178390283012831893193103293',
      barCodeNumber: '804284028402804820482',
      links: [{
        href: 'https://blablabla.com',
        rel: 'PDF',
        method: 'GET',
      }],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'registered')
})

test('translateResponseCode: registered with empty errors', (t) => {
  const axiosResponse = {
    data: {
      id: '37279202382',
      digitableLine: '98139178390283012831893193103293',
      barCodeNumber: '804284028402804820482',
      links: [{
        href: 'https://blablabla.com',
        rel: 'PDF',
        method: 'GET',
      }],
      errors: [],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'registered')
})

test('translateResponseCode: with a "refused" code', (t) => {
  const axiosResponse = {
    data: {
      errors: [{
        code: '1',
        message: '(27) UF DO PAGADOR NAO INFORMADA',
      }],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'refused')
})

test('translateResponseCode: with a "unknown" code (should refuse for Caixa)', (t) => {
  const axiosResponse = {
    data: {
      errors: [{
        code: '1',
        message: '(XX) unknownnnnnn',
      }],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'refused')
})

test('translateResponseCode: with a "MP" error', (t) => {
  const axiosResponse = {
    data: {
      errors: [{
        code: 'MP400',
        message: 'O nome de usuário e senha devem ser preenchidos',
      }],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'refused')
})

test('buildHeaders', (t) => {
  const encryptedHeaders = buildHeaders()

  const expectedHeader = {
    Authorization: 'Basic RkFLRVVTUkNBSVhBOkZBS0VQV0RDQUlYQQ==',
  }

  t.deepEqual(encryptedHeaders, expectedHeader)
})
