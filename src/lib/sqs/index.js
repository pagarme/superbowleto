const { SQS, Credentials } = require('aws-sdk')
const getConfig = require('../../config/sqs')

const config = getConfig()

const sqs = new SQS({
  region: config.region,
  endpoint: config.endpoint,
  credentials: new Credentials({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    sessionToken: config.sessionToken,
  }),
})

module.exports = sqs
