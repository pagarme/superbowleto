import test from 'ava'
import {
  getDocumentType,
  formatStateCode,
  getPayloadWithoutAuth,
} from '../../../../src/providers/boleto-api-bradesco-shopfacil/formatter'

test('getDocumentType: when document is CPF', (t) => {
  const documentNumber = '01234567890'
  const result = getDocumentType(documentNumber)

  t.is(result, 'CPF')
})

test('getDocumentType: when document is CNPJ', (t) => {
  const documentNumber = '01234567890123'
  const result = getDocumentType(documentNumber)

  t.is(result, 'CNPJ')
})

test('getDocumentType: when document is wrong, return default', (t) => {
  const documentNumber = '1'
  const result = getDocumentType(documentNumber)

  t.is(result, 'CNPJ')
})

test('getDocumentType: when document is CPF and has spaces', (t) => {
  const documentNumber = '    01234567890 '
  const result = getDocumentType(documentNumber)

  t.is(result, 'CPF')
})

test('getDocumentType: when document is CNPJ and has spaces', (t) => {
  const documentNumber = '    01234567890123 '
  const result = getDocumentType(documentNumber)

  t.is(result, 'CNPJ')
})

test('formatStateCode: finding state on list for payer_address', (t) => {
  const boleto = {
    payer_address: {
      state: 'rio de janeiro',
    },
  }

  const result = formatStateCode(boleto, 'payer_address')

  t.is(result, 'RJ')
})

test('formatStateCode: not finding state on list for payer_address', (t) => {
  const boleto = {
    payer_address: {
      state: 'Illinois',
    },
  }

  const result = formatStateCode(boleto, 'payer_address')

  t.is(result, 'ILLINOIS')
})

test('formatStateCode: finding state on list for company_address', (t) => {
  const boleto = {
    company_address: {
      state: '  sãO paUlo  ',
    },
  }

  const result = formatStateCode(boleto, 'company_address')

  t.is(result, 'SP')
})

test('formatStateCode: not finding state on list for company_address', (t) => {
  const boleto = {
    company_address: {
      state: 'Guanajuato',
    },
  }

  const result = formatStateCode(boleto, 'company_address')

  t.is(result, 'GUANAJUATO')
})

test('formatStateCode: when does not provide a valid "from"', (t) => {
  const boleto = {
    company_address: {
      state: 'Guanajuato',
    },
  }

  const result = formatStateCode(boleto, 'wrong')

  t.is(result, '')
})

test('getPayloadWithouAuth: when object has authentication', (t) => {
  const payload = {
    amount: 100,
    authentication: {
      username: 'SENSITIVE DATA',
      payload: 'SENSITIVE DATA',
    },
  }

  const payloadWithoutAuth = getPayloadWithoutAuth(payload)

  t.is(payloadWithoutAuth.authentication, undefined)
  t.not(payload.authentication, undefined)
})

test('getPayloadWithouAuth: when object has not authentication', (t) => {
  const payload = {
    amount: 100,
  }

  const payloadWithoutAuth = getPayloadWithoutAuth(payload)

  t.is(payloadWithoutAuth.authentication, undefined)
  t.is(payload.authentication, undefined)
})
