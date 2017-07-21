import { getEnv } from '../../config'

import * as Credstash from 'nodecredstash'

const credstash = new Credstash({
  awsOpts: { region: 'us-east-1' },
  table: 'credential-store'
})

const superBowletoEnvStage = `superbowleto/${process.env.STAGE}`
const apiKey = 'bbE9XN8RhOyA9-79HHPnbJ1-Qqy7kzoKGdR-Njmi9fg'

const localCredstashTable = {
  [`${superBowletoEnvStage}/database/password`]: 'touchdown1!',
  [`${superBowletoEnvStage}/providers/bradesco/company_id`]: '100005254',
  [`${superBowletoEnvStage}/providers/bradesco/api_key`]: apiKey
}

export const getCredentials = memoize((key: string): Promise<string> => {
  const credstashKey = `${superBowletoEnvStage}/${key}`

  if (getEnv() === 'test') {
    return Promise.resolve('touchdown1!')
  }

  return credstash.getSecret({
    name: `${process.env.STAGE}/database/password`,
    version: 1,
    context: {}
  })
}
