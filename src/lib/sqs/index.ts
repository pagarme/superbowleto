import { SQS, Credentials } from 'aws-sdk'
import getConfig from '../../config/sqs'

const config = getConfig()

const sqs = new SQS({
  region: config.region,
  endpoint: config.endpoint,
  credentials: new Credentials({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    sessionToken: config.sessionToken
  })
})

export default sqs
