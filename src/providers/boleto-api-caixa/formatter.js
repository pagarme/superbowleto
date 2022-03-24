const moment = require('moment')
const {
  path,
  pipe,
  toLower,
  toUpper,
  trim,
} = require('ramda')

const brazilianStates = require('../../lib/helpers/brazilian-states')

const formatDate = timestamp => moment(timestamp).format('YYYY-MM-DD')

const formatStateCode = (boleto, from) => {
  const possibilities = ['payer_address', 'company_address']

  if (!possibilities.includes(from)) {
    return ''
  }

  const formatted = pipe(
    path([from, 'state']),
    toLower,
    trim,
    state => brazilianStates[state] || state,
    toUpper
  )

  return formatted(boleto)
}

const getDocumentType = (documentNumber) => {
  if (!documentNumber) {
    return ''
  }
  const documentLength = String(documentNumber).trim().length
  if (documentLength === 11) {
    return 'CPF'
  }
  return 'CNPJ'
}

module.exports = {
  formatDate,
  formatStateCode,
  getDocumentType,
}
