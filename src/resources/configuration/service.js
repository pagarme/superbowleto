const database = require('../../database')
const { NotFoundError } = require('../../lib/errors')
const { handleDatabaseErrors } = require('../../lib/errors/database')
const { makeFromLogger } = require('../../lib/logger')

const { Configuration } = database.models

const makeLogger = makeFromLogger('configuration/service')

module.exports = function configutarionService ({ operationId }) {
  const update = async (data) => {
    const {
      id,
      issuer,
      issuer_account: issuerAccount,
      issuer_agency: issuerAgency,
      issuer_wallet: issuerWallet,
    } = data

    const logger = makeLogger({ operation: 'update' }, { id: operationId })
    logger.info({ status: 'started', metadata: { data } })

    const query = {
      where: {
        id,
      },
    }

    try {
      const config = await Configuration.findOne(query)

      if (!config) {
        throw new NotFoundError({
          message: 'Configuration not found',
        })
      }

      logger.info({
        status: 'success',
        metadata: {
          config,
        },
      })

      return config.update({
        issuer: issuer || config.issuer,
        issuer_account: issuerAccount || config.issuer_account,
        issuer_agency: issuerAgency || config.issuer_agency,
        issuer_wallet: issuerWallet || config.issuer_wallet,
      })
    } catch (err) {
      throw handleDatabaseErrors(err)
    }
  }

  const show = async (externalId) => {
    const query = {
      where: {
        external_id: externalId,
      },
    }

    try {
      const config = await Configuration.findOne(query)

      if (!config) {
        throw new NotFoundError({
          message: 'Configuration not found',
        })
      }

      return config
    } catch (err) {
      throw handleDatabaseErrors(err)
    }
  }

  return {
    update,
    show,
  }
}
