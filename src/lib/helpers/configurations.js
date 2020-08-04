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

module.exports = {
  findBoletoConfiguration,
}
