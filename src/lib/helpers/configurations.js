const database = require('../../database')
const {
  merge,
} = require('ramda')

const { Configuration } = database.models

const findBoletoConfiguration = async (boleto) => {
  const {
    external_id: externalId,
  } = boleto

  const defaultId = 'pagarme'
  let configuration

  if (externalId) {
    configuration = await Configuration.findOne({
      where: {
        external_id: externalId,
      },
      raw: true,
    })
  }

  if (!configuration) {
    configuration = await Configuration.findOne({
      where: {
        external_id: defaultId,
      },
      raw: true,
    })
  }

  if (!configuration) {
    return boleto
  }

  const updatedRequestConfig = {
    issuer: configuration.issuer,
    issuer_account: configuration.issuer_account,
    issuer_agency: configuration.issuer_agency,
    issuer_wallet: configuration.issuer_wallet,
  }

  return merge(boleto, updatedRequestConfig)
}

const setBoletoRulesConfiguration = (boleto) => {
  const config = {
    issuer: 'bradesco',
    issuer_account: '469',
    issuer_agency: '1229',
  }

  if (boleto.rules) {
    if (boleto.rules.includes('strict_expiration_date')) {
      return merge(boleto, { ...config, issuer_wallet: '25' })
    }
    if (boleto.rules.includes('no_strict')) {
      return merge(boleto, { ...config, issuer_wallet: '26' })
    }
  }

  return findBoletoConfiguration(boleto)
}

module.exports = {
  setBoletoRulesConfiguration,
  findBoletoConfiguration,
}
