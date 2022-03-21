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
    external_id: externalId,
  } = boleto

  const companyCaixaFineAndInterestTestId = '5aba73e21b9d0d663cb107a0'

  const isBoletoApi =
    issuer.includes('boleto-api') && externalId !== companyCaixaFineAndInterestTestId

  if (isBoletoApi &&
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

module.exports = {
  changeIssuerWhenInterestOrFine,
  isEmptyOrNull,
}
