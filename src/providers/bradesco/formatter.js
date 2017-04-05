import moment from 'moment'
import {
  always,
  cond,
  curryN,
  equals,
  mapObjIndexed
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

export const formatWithTemplate = curryN(2, (template, data) => {
  const mapper = (val) => {
    if (typeof val === 'object') {
      return mapObjIndexed(mapper, val)
    }

    return val(data)
  }

  return mapObjIndexed(mapper, template)
})

