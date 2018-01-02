// tslint:disable:max-line-length
const { memoize, prop } = require('ramda')
const { getEnv } = require('../../config')
const { makeFromLogger } = require('../../lib/logger')

const makeLogger = makeFromLogger('lib/credentials')
const Credstash = require('nodecredstash')

const credstash = new Credstash({
  table: 'credential-store',
  awsOpts: { region: 'us-east-1' }
})

const stage = process.env.STAGE

const localCredstashTable = {
  [`superbowleto/${stage}/database/password`]: 'touchdown1!',
  [`superbowleto/${stage}/providers/bradesco/company_id`]: '100005254',
  [`superbowleto/${stage}/providers/bradesco/api_key`]: 'bbE9XN8RhOyA9-79HHPnbJ1-Qqy7kzoKGdR-Njmi9fg'
}

const getCredentials = memoize((key: string): Promise<string> => {
  const logger = makeLogger({ operation: 'getCredentials' })
  const credstashKey = `superbowleto/${stage}/${key}`

  logger.info({ status: 'started', metadata: { credstashKey } })

  if (getEnv() === 'test') {
    return Promise.resolve(prop(credstashKey, localCredstashTable))
  }

  return credstash.getSecret({
    name: credstashKey
  })
    .catch((err) => {
      logger.error({
        status: 'failed',
        metadata: {
          error_name: err.name,
          error_stack: err.stack,
          error_message: err.message
        }
      })
      return Promise.reject(err)
    })
})

module.exports = {
  getCredentials
}
