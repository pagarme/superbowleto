import test from 'ava'
import moment from 'moment'
import { always, prop } from 'ramda'
import {
  date,
  documentType,
  format,
  formatWithTemplate
} from '../../../../src/providers/bradesco/formatter'

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

test('formatWithTemplate', (t) => {
  const getPrice = data => data.price * 100

  const template = {
    buyer: always('David Bowie'),
    address: prop('address'),
    product: {
      price: getPrice
    }
  }

  const data = {
    price: 99.6,
    address: '205 Bacon St'
  }

  const result = formatWithTemplate(template, data)

  t.deepEqual(result, {
    buyer: 'David Bowie',
    address: '205 Bacon St',
    product: {
      price: 9960
    }
  })
})

