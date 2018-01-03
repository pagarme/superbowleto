import test from 'ava'
import moment from 'moment'
import {
  date,
  documentType,
  format,
} from '../../../../src/providers/bradesco/formatter'

test('date: when timezones are in different days', (t) => {
  const timestamp = moment('2017-04-03T00:00:00-00:00').format()
  const result = date(timestamp)

  t.is(result, '2017-04-02')
})

test('date: when both timezones are in the same day', (t) => {
  const timestamp = moment('2017-04-03T12:00:00-00:00').format()
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

