import test from 'ava'
import { parse } from '../../../../src/lib/http/request'

const { createSchema } = require('../../../../src/resources/boleto/schema')

function createMockedSchema (date = '2024-02-23') {
  return {
    payer_name: 'Teste da Silva',
    issuer: 'bradesco',
    queue_url: 'https://pruu.herokuapp.com/dump/super-bowleto-postback',
    expiration_date: date,
    amount: 2000,
    issuer_account: '469',
    issuer_agency: '1229',
    issuer_wallet: '29',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872',
  }
}

function createExpectedObject (date = '2024-02-23 00:00:00') {
  return {
    payer_name: 'Teste da Silva',
    issuer: 'bradesco',
    queue_url: 'https://pruu.herokuapp.com/dump/super-bowleto-postback',
    expiration_date: new Date(date),
    amount: 2000,
    issuer_account: '469',
    issuer_agency: '1229',
    issuer_wallet: '29',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872',
    register: true,
  }
}

test('Expiration date limit - when issuer is boleto-api-caixa and expiration-date greater than 2025-02-22, should not return erros', async (t) => {
  const mockedSchema = createMockedSchema('2025-02-23')
  mockedSchema.issuer = 'boleto-api-caixa'

  await t.notThrows(async () => parse(createSchema, mockedSchema))
})

test('Expiration date limit - when issuer is development and expiration-date greater than 2025-02-22, should not return erros', async (t) => {
  const mockedSchema = createMockedSchema('2025-02-23')
  mockedSchema.issuer = 'development'

  await t.notThrows(async () => parse(createSchema, mockedSchema))
})

test('sanitizePayerName: when issuer is Bradesco with special characters that should be sanitized', async (t) => {
  const mockedSchema = createMockedSchema()
  mockedSchema.payer_name = '𝑱𝒆𝒔𝒔𝒊𝒄𝒂⁶ Ⓨ︎Ⓞ︎Ⓛ︎Ⓐ︎Ⓝ︎Ⓓ︎Ⓞ︎ ⅒ 𝒅𝒂 Silva'
  mockedSchema.issuer = 'bradesco'

  const testExpectedObject = createExpectedObject()
  testExpectedObject.payer_name = 'Jessica6 YOLANDO 110 da Silva'
  const value = await parse(createSchema, mockedSchema)

  t.deepEqual(value, testExpectedObject, 'should have the correct parsed, coerced parameters and no errors')
})

test('sanitizePayerName: when issuer is Bradesco with special characters that should be kept', async (t) => {
  const mockedSchema = createMockedSchema()
  mockedSchema.payer_name = 'João & José $$ (#2022*) @ LTDA ABCDEFGHIJKLMNOPQRSTUVXYWZabcdefghijklmnopqrstuvxyz ÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕáéíóúàèìòùâêîôûãõçÇ 0123456789'
  mockedSchema.issuer = 'bradesco'

  const testExpectedObject = createExpectedObject()
  testExpectedObject.payer_name = 'João & José $$ (#2022*) @ LTDA ABCDEFGHIJKLMNOPQRSTUVXYWZabcdefghijklmnopqrstuvxyz ÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕáéíóúàèìòùâêîôûãõçÇ 0123456789'
  const value = await parse(createSchema, mockedSchema)

  t.deepEqual(value, testExpectedObject, 'should have the correct parsed, coerced parameters and no errors')
})

test('sanitizePayerName: when using wrong issuer should NOT sanitize', async (t) => {
  const mockedSchema = createMockedSchema()
  mockedSchema.payer_name = 'Ⓨ︎Ⓞ︎Ⓛ︎Ⓐ︎Ⓝ︎Ⓓ︎Ⓞ︎'
  mockedSchema.issuer = 'boleto-api-caixa'

  const testExpectedObject = createExpectedObject()
  testExpectedObject.payer_name = 'Ⓨ︎Ⓞ︎Ⓛ︎Ⓐ︎Ⓝ︎Ⓓ︎Ⓞ︎'
  testExpectedObject.issuer = 'boleto-api-caixa'

  const value = await parse(createSchema, mockedSchema)

  t.deepEqual(value, testExpectedObject, 'should have the correct parsed, coerced parameters and no errors')
})

test('sanitizePayerName: when using wrong-like issuer should NOT sanitize', async (t) => {
  const mockedSchema = createMockedSchema()
  mockedSchema.payer_name = 'Ⓨ︎Ⓞ︎Ⓛ︎Ⓐ︎Ⓝ︎Ⓓ︎Ⓞ︎'
  mockedSchema.issuer = 'boleto-api-bradesco-shopfacil'

  const testExpectedObject = createExpectedObject()
  testExpectedObject.payer_name = 'Ⓨ︎Ⓞ︎Ⓛ︎Ⓐ︎Ⓝ︎Ⓓ︎Ⓞ︎'
  testExpectedObject.issuer = 'boleto-api-bradesco-shopfacil'

  const value = await parse(createSchema, mockedSchema)

  t.deepEqual(value, testExpectedObject, 'should have the correct parsed, coerced parameters and no errors')
})
