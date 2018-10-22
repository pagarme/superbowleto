const moment = require('moment')
const {
  always,
  cond,
  equals,
} = require('ramda')

const date = timestamp => moment(timestamp).format('YYYY-MM-DD')

const documentType = cond([
  [equals('cpf'), always('1')],
  [equals('cnpj'), always('2')],
])

const format = cond([
  [equals('date'), always(date)],
  [equals('documentType'), always(documentType)],
])

module.exports = {
  date,
  documentType,
  format,
}
