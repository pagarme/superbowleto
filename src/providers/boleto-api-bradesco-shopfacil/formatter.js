const moment = require('moment')

const formatDate = timestamp => moment(timestamp).format('YYYY-MM-DD')

const getDocumentType = (documentNumber) => {
  const documentLength = String(documentNumber).trim().length

  if (documentLength === 11) {
    return 'CPF'
  }

  return 'CNPJ'
}

module.exports = {
  formatDate,
  getDocumentType,
}
