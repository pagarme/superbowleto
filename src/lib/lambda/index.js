const { Lambda, Credentials } = require('aws-sdk')

const getConfig = require('../../config/lambda')

const config = getConfig()

const lambda = new Lambda({
  region: config.region,
  endpoint: config.endpoint,
  credentials: new Credentials({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    sessionToken: config.sessionToken,
  }),
})

module.exports = lambda
