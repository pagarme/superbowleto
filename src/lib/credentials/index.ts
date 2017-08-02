import { memoize, prop } from 'ramda'
import { getEnv } from '../../config'
import { makeFromLogger } from '../../lib/logger'

const makeLogger = makeFromLogger('lib/credentials')
import * as Credstash from 'nodecredstash'

const credstash = new Credstash({
  awsOpts: { region: 'us-east-1' },
  table: 'credential-store'
})

const superbowletoEnvStage = `superbowleto/${process.env.STAGE}`
const apiKey = 'bbE9XN8RhOyA9-79HHPnbJ1-Qqy7kzoKGdR-Njmi9fg'

const localCredstashTable = {
  [`${superbowletoEnvStage}/database/password`]: 'touchdown1!',
  [`${superbowletoEnvStage}/providers/bradesco/company_id`]: '100005254',
  [`${superbowletoEnvStage}/providers/bradesco/api_key`]: apiKey
}

export const getCredentials = memoize((key: string): Promise<string> => {
  const logger = makeLogger({ operation: 'getCredentials' })
  const credstashKey = `${superbowletoEnvStage}/${key}`

  logger.info({ status: 'started', metadata: { credstashKey } })
  if (getEnv() === 'test') {
    return Promise.resolve(prop(credstashKey, localCredstashTable))
  }

  return credstash.getSecret({
    name: credstashKey
  })
    .catch((err) => {
      logger.error({ status: 'failed', metadata: { err } })
      return Promise.reject(err)
    })
})
