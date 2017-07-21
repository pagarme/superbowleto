import { Credentials, SQS } from 'aws-sdk'
import getConfig from '../../config/sqs'

const config = getConfig()

const sqs = new SQS({
  credentials: new Credentials({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  }),
  endpoint: config.endpoint,
  region: config.region
})

export default sqs
