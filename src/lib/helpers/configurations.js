const database = require('../../database')
const {
  merge,
} = require('ramda')

const { makeFromLogger } = require('../logger')

const makeLogger = makeFromLogger('helpers/providers')

const { Configuration } = database.models

const findBoletoConfiguration = async (boleto, operationId) => {
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

  const logger = makeLogger(
    {
      operation: 'update_from_configuration',
    },
    { id: operationId }
  )

  logger.info({
    status: 'success',
    metadata: {
      issuer: configuration.issuer,
      issuer_account: configuration.issuer_account,
      issuer_agency: configuration.issuer_agency,
      issuer_wallet: configuration.issuer_wallet,
    },
  })

  return merge(boleto, updatedRequestConfig)
}

const setBoletoRulesConfiguration = (boleto, operationId) => {
  let config

  const configBradesco = {
    issuer: 'bradesco',
    issuer_account: '469',
    issuer_agency: '1229',
  }

  const configCaixa = {
    issuer: 'boleto-api-caixa',
    issuer_account: '1103388',
    issuer_agency: '3337',
  }

  if (boleto.issuer === 'boleto-api-caixa') {
    config = configCaixa
  } else {
    config = configBradesco
  }

  if (boleto.rules && boleto.issuer !== 'development') {
    const logger = makeLogger(
      {
        operation: 'change_issuer_wallet',
      },
      { id: operationId }
    )

    if (boleto.rules.includes('strict_expiration_date')) {
      logger.info({
        status: 'success',
        metadata: {
          rules: boleto.rules,
          issuer_wallet: '25',
        },
      })

      return merge(boleto, { ...config, issuer_wallet: '25' })
    }

    if (boleto.rules.includes('no_strict')) {
      logger.info({
        status: 'success',
        metadata: {
          rules: boleto.rules,
          issuer_wallet: '26',
        },
      })

      return merge(boleto, { ...config, issuer_wallet: '26' })
    }
  }

  return findBoletoConfiguration(boleto, operationId)
}

module.exports = {
  setBoletoRulesConfiguration,
  findBoletoConfiguration,
}
