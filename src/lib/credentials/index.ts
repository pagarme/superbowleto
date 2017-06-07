import { getEnv } from '../../config'

const Credstash = require('nodecredstash')

export function getDatabasePassword () {
  const credstash = Credstash({
    table: 'database',
    awsOpts: { region: 'us-east-1' }
  })

  if (getEnv() === 'test') {
    return Promise.resolve('touchdown1!')
  }

  return credstash.getSecret({
    name: `${process.env.STAGE}/database/password`,
    version: 1,
    context: {}
  })
}
