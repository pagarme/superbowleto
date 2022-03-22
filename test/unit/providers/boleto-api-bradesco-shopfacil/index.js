import test from 'ava'
import moment from 'moment'
import cuid from 'cuid'
import { prop } from 'ramda'
import { createBoleto } from '../../../helpers/boleto'
import {
  buildHeaders,
  buildPayload,
  translateResponseCode,
} from '../../../../src/providers/boleto-api-bradesco-shopfacil'
import {
  getDocumentType,
} from '../../../../src/providers/boleto-api-bradesco-shopfacil/formatter'
import config from '../../../../src/config/providers'

const {
  username: usernameShopfacil,
  password: passwordShopfacil,
} = prop('boleto-api-bradesco-shopfacil', config)

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
    bankNumber: 237,
    authentication: {
      username: usernameShopfacil,
      password: passwordShopfacil,
    },
    agreement: {
      agreementNumber: 3069995,
      wallet: parseInt(boleto.issuer_wallet, 10),
      agency: boleto.issuer_agency,
      account: boleto.issuer_account,
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
        type: boleto.payer_document_type,
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
    bankNumber: 237,
    authentication: {
      username: usernameShopfacil,
      password: passwordShopfacil,
    },
    agreement: {
      agreementNumber: 3069995,
      wallet: parseInt(boleto.issuer_wallet, 10),
      agency: boleto.issuer_agency,
      account: boleto.issuer_account,
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
        type: boleto.payer_document_type,
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

test('Given boleto with payer_address.street_number as number, when buildPayload, should consider as string', async (t) => {
  const boleto = await createBoleto({
    payer_address: {
      zipcode: '5555555',
      street_number: 308,
      complementary: '11º andar',
      neighborhood: 'Brooklin',
      city: 'São Paulo',
      state: 'SP',
      street: 'lalalalalalal',
    },
  })

  const operationId = cuid()

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.buyer.address, {
    street: boleto.payer_address.street,
    number: String(boleto.payer_address.street_number),
    complement: boleto.payer_address.complementary,
    district: boleto.payer_address.neighborhood,
    zipCode: boleto.payer_address.zipcode,
    city: boleto.payer_address.city,
    stateCode: boleto.payer_address.state,
  })
})

test('Given boleto with recipient.street_number as number, when buildPayload, should consider as string', async (t) => {
  const boleto = await createBoleto({
    company_address: {
      zipcode: '5555555',
      street_number: 308,
      complementary: '11º andar',
      neighborhood: 'Brooklin',
      city: 'São Paulo',
      state: 'SP',
      street: 'lalalalalalal',
    },
  })

  const operationId = cuid()

  const payload = buildPayload(boleto, operationId)

  t.deepEqual(payload.recipient.address, {
    street: boleto.company_address.street,
    number: String(boleto.company_address.street_number),
    complement: boleto.company_address.complementary,
    district: boleto.company_address.neighborhood,
    zipCode: boleto.company_address.zipcode,
    city: boleto.company_address.city,
    stateCode: boleto.company_address.state,
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
        code: '-401',
        message: 'Código de compra já autorizado',
      }],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'refused')
})

test('translateResponseCode: with a "unknown" code', (t) => {
  const axiosResponse = {
    data: {
      errors: [{
        code: '306',
        message: 'unknownnnnnn',
      }],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'unknown')
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
    Authorization: 'Basic RkFLRVVTUjpGQUtFUFdE',
  }

  t.deepEqual(encryptedHeaders, expectedHeader)
})
