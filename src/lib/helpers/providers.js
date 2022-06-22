const {
  isEmpty,
  isNil,
  merge,
} = require('ramda')

const { makeFromLogger } = require('../logger')

const makeLogger = makeFromLogger('helpers/providers')

const isEmptyOrNull = key => isEmpty(key) || isNil(key)

const changeIssuerWhenInterestOrFine = (boleto, operationId) => {
  const {
    fine,
    interest,
    issuer,
  } = boleto

  const isBoletoApiProviderWithoutInterestAndFine =
    issuer.includes('boleto-api-bradesco-shopfacil')

  if (isBoletoApiProviderWithoutInterestAndFine &&
    (!isEmptyOrNull(interest) || !isEmptyOrNull(fine))) {
    const config = {
      issuer: 'bradesco',
      issuer_account: '469',
      issuer_agency: '1229',
      issuer_wallet: '26',
    }

    const logger = makeLogger(
      {
        operation: 'change_issuer_interest_or_fine',
      },
      { id: operationId }
    )

    logger.info({
      status: 'success',
      metadata: {
        oldIssuer: issuer,
        newIssuer: config.issuer,
      },
    })

    return merge(boleto, config)
  }

  return boleto
}

const buildBoletoApiErrorResponse = ({ code, message }) => ({
  data: {
    errors: [{
      code,
      message,
    }],
  },
})

module.exports = {
  changeIssuerWhenInterestOrFine,
  isEmptyOrNull,
  buildBoletoApiErrorResponse,
}
