import test from 'ava'
import moment from 'moment'
import cuid from 'cuid'
import { createBoleto } from '../../../helpers/boleto'
import {
  buildHeaders,
  buildPayload,
  translateResponseCode,
  isHtml,
  getBoletoUrl,
} from '../../../../src/providers/boleto-api-caixa'

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
      agency: '3337',
    },
    title: {
      expireDate: moment(boleto.expiration_date).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
      amountInCents: boleto.amount,
      ourNumber: boleto.title_id,
      instructions: boleto.instructions,
      documentNumber: String(boleto.title_id),
    },
    recipient: {
      name: `${boleto.company_name} | Pagar.me Pagamentos S/A`,
      document: {
        type: 'CNPJ',
        number: '18727053000174',
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
      agency: '3337',
    },
    title: {
      expireDate: moment(boleto.expiration_date).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
      amountInCents: boleto.amount,
      ourNumber: boleto.title_id,
      instructions: boleto.instructions,
      documentNumber: String(boleto.title_id),
    },
    recipient: {
      name: `${boleto.company_name} | Pagar.me Pagamentos S/A`,
      document: {
        type: 'CNPJ',
        number: '18727053000174',
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
        href: 'https://blablahtml.com',
        rel: 'html',
        method: 'GET',
      },
      {
        href: 'https://blablapdf.com',
        rel: 'PDF',
        method: 'GET',
      }],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'registered')
  t.is(response.boleto_url, 'https://blablahtml.com')
  t.is(response.digitable_line, '98139178390283012831893193103293')
  t.is(response.barcode, '804284028402804820482')
})

test('translateResponseCode: registered with empty errors', (t) => {
  const axiosResponse = {
    data: {
      id: '37279202382',
      digitableLine: '98139178390283012831893193103293',
      barCodeNumber: '804284028402804820482',
      links: [{
        href: 'https://blablapdf.com',
        rel: 'PDF',
        method: 'GET',
      },
      {
        href: 'https://blablahtml.com',
        rel: 'html',
        method: 'GET',
      }],
      errors: [],
    },
  }

  const response = translateResponseCode(axiosResponse)

  t.is(response.status, 'registered')
  t.is(response.boleto_url, 'https://blablahtml.com')
  t.is(response.digitable_line, '98139178390283012831893193103293')
  t.is(response.barcode, '804284028402804820482')
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

test('translateResponseCode: with response missing html link', (t) => {
  const axiosResponse = {
    data: {
      id: '37279202382',
      digitableLine: '98139178390283012831893193103293',
      barCodeNumber: '804284028402804820482',
      links: [
        {
          href: 'https://blablapdf.com',
          rel: 'PDF',
          method: 'GET',
        }],
    },
  }

  const error = t.throws(() => {
    translateResponseCode(axiosResponse)
  })

  t.is(error.message, 'URL do boleto não existe')
})

test('translateResponseCode: with response missing digitable line', (t) => {
  const axiosResponse = {
    data: {
      id: '37279202382',
      barCodeNumber: '804284028402804820482',
      links: [
        {
          href: 'https://blablahtml.com',
          rel: 'html',
          method: 'GET',
        }],
    },
  }

  const error = t.throws(() => {
    translateResponseCode(axiosResponse)
  })

  t.is(error.message, 'linha digitável do boleto não existe')
})

test('translateResponseCode: with response missing barcode', (t) => {
  const axiosResponse = {
    data: {
      id: '37279202382',
      digitableLine: '98139178390283012831893193103293',
      links: [
        {
          href: 'https://blablahtml.com',
          rel: 'html',
          method: 'GET',
        }],
    },
  }

  const error = t.throws(() => {
    translateResponseCode(axiosResponse)
  })

  t.is(error.message, 'código de barras do boleto não existe')
})

test('buildHeaders', (t) => {
  const encryptedHeaders = buildHeaders()

  const expectedHeader = {
    Authorization: 'Basic RkFLRVVTUkNBSVhBOkZBS0VQV0RDQUlYQQ==',
  }

  t.deepEqual(encryptedHeaders, expectedHeader)
})

test('isHtml: when rel prop is html', (t) => {
  const links = {
    href: 'https://blablahtml.com',
    rel: 'html',
    method: 'GET',
  }

  const response = isHtml(links)

  t.is(response, true)
})

test('isHtml: when rel prop is pdf', (t) => {
  const links = {
    href: 'https://blablahtml.com',
    rel: 'pdf',
    method: 'GET',
  }

  const response = isHtml(links)

  t.is(response, false)
})

test('getBoletoUrl', (t) => {
  const axiosResponse = {
    id: '37279202382',
    digitableLine: '98139178390283012831893193103293',
    barCodeNumber: '804284028402804820482',
    links: [{
      href: 'https://blablahtml.com',
      rel: 'html',
      method: 'GET',
    },
    {
      href: 'https://blablapdf.com',
      rel: 'PDF',
      method: 'GET',
    }],
  }

  const response = getBoletoUrl(axiosResponse)

  t.is(response, 'https://blablahtml.com')
})
