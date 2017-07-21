import { getEnv } from '../../config'

import * as Credstash from 'nodecredstash'

const credstash = new Credstash({
  awsOpts: { region: 'us-east-1' },
  table: 'credential-store'
})

const localCredstashTable = {
  [`superbowleto/${process.env.STAGE}/database/password`]: 'touchdown1!',
  [`superbowleto/${process.env.STAGE}/providers/bradesco/company_id`]: '100005254',
  [`superbowleto/${process.env.STAGE}/providers/bradesco/api_key`]: 'bbE9XN8RhOyA9-79HHPnbJ1-Qqy7kzoKGdR-Njmi9fg'
}

export const getCredentials = memoize((key: string): Promise<string> => {
  const credstashKey = `superbowleto/${process.env.STAGE}/${key}`

  if (getEnv() === 'test') {
    return Promise.resolve('touchdown1!')
  }

  return credstash.getSecret({
    name: `${process.env.STAGE}/database/password`,
    version: 1,
    context: {}
  })
}
