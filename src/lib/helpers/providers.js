const {
  isEmpty,
  isNil,
  assoc,
} = require('ramda')

const { makeFromLogger } = require('../logger')

const makeLogger = makeFromLogger('helpers/providers')

const isEmptyOrNull = key => isEmpty(key) || isNil(key)

const changeIssuerWhenInterestOrFine = (boleto) => {
  const {
    fine,
    interest,
    issuer,
  } = boleto

  const issuerIsBoletoApi = issuer.includes('boleto-api')

  if (issuerIsBoletoApi && (!isEmptyOrNull(interest) || !isEmptyOrNull(fine))) {
    const defaultIssuer = 'bradesco'

    const logger = makeLogger({
      operation: 'change_issuer',
    })

    logger.info({
      status: 'success',
      metadata: {
        oldIssuer: issuer,
        newIssuer: defaultIssuer,
      },
    })

    return assoc('issuer', defaultIssuer, boleto)
  }

  return boleto
}

module.exports = {
  changeIssuerWhenInterestOrFine,
  isEmptyOrNull,
}
