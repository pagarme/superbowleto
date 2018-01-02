const moment = require('moment-timezone')
const {
  always,
  cond,
  equals
} = require('ramda')

const date = timestamp => moment(timestamp).tz('America/Sao_Paulo').format('YYYY-MM-DD')

const documentType = cond([
  [equals('cpf'), always('1')],
  [equals('cnpj'), always('2')]
])

const format = cond([
  [equals('date'), always(date)],
  [equals('documentType'), always(documentType)]
])

module.exports = {
  date,
  documentType,
  format
}
