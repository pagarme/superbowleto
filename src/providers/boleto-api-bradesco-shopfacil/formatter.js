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

const getDocumentType = (documentNumber) => {
  const documentLength = String(documentNumber).trim().length

  if (documentLength === 11) {
    return 'CPF'
  }

  return 'CNPJ'
}

const formatStateCode = (boleto, from) => {
  const possibilities = ['payer_address', 'company_address']

  if (!possibilities.includes(from)) {
    return ''
  }

  return pipe(
    path([from, 'state']),
    toLower,
    trim,
    state => brazilianStates[state] || state,
    toUpper
  )(boleto)
}

module.exports = {
  formatDate,
  formatStateCode,
  getDocumentType,
}
