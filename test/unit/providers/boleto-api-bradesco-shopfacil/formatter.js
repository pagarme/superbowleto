import test from 'ava'
import {
  getDocumentType,
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
