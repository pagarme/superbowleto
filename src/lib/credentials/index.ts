import { memoize, prop } from 'ramda'
import { getEnv } from '../../config'

const Credstash = require('nodecredstash')

const credstash = new Credstash({
  table: 'credential-store',
  awsOpts: { region: 'us-east-1' }
})

const localCredstashTable = {
  [`superbowleto/${process.env.STAGE}/database/password`]: 'touchdown1!',
  [`superbowleto/${process.env.STAGE}/providers/bradesco/company_id`]: '100005254',
  [`superbowleto/${process.env.STAGE}/providers/bradesco/api_key`]: 'bbE9XN8RhOyA9-79HHPnbJ1-Qqy7kzoKGdR-Njmi9fg'
}

export const getCredentials = memoize((key: string): Promise<string> => {
  const credstashKey = `superbowleto/${process.env.STAGE}/${key}`

  if (getEnv() === 'test') {
    return Promise.resolve(prop(credstashKey, localCredstashTable))
  }

  return credstash.getSecret({
    name: credstashKey
  })
})
