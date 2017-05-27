import test from 'ava'
import moment from 'moment'
import {
  date,
  documentType,
  format
} from '../../../../build/providers/bradesco/formatter'

test('date', (t) => {
  const timestamp = moment('2017-04-03').format()
  const result = date(timestamp)

  t.is(result, '2017-04-03')
})

test('documentType: with cpf', (t) => {
  const result = documentType('cpf')
  t.is(result, '1')
})

test('documentType: with cnpj', (t) => {
  const result = documentType('cnpj')
  t.is(result, '2')
})

test('format', (t) => {
  const result = format('documentType')('cnpj')
  t.is(result, '2')
})

