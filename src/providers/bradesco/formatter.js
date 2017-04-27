import moment from 'moment'
import {
  always,
  cond,
  equals
} from 'ramda'

export const date = timestamp => moment(timestamp).format('YYYY-MM-DD')

export const documentType = cond([
  [equals('cpf'), always('1')],
  [equals('cnpj'), always('2')]
])

export const format = cond([
  [equals('date'), always(date)],
  [equals('documentType'), always(documentType)]
])
