const { SQS, Credentials } = require('aws-sdk')
const getConfig = require('../../config/sqs')

const config = getConfig()

const initializeSQS = () => {
  if (process.env.NODE_ENV === 'production') {
    return new SQS({
      region: config.region,
      endpoint: config.endpoint,
    })
  }

  return new SQS({
    region: config.region,
    endpoint: config.endpoint,
    credentials: new Credentials({
      accessKeyId: 'x',
      secretAccessKey: 'x',
    }),
  })
}

const sqs = initializeSQS()

module.exports = sqs
