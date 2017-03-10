import { SQS, Credentials } from 'aws-sdk'
import rawConfig from '../../config/sqs.json'

const env = process.env.NODE_ENV || 'test'
const config = rawConfig[env]

const sqs = new SQS({
  region: config.region,
  endpoint: config.endpoint,
  credentials: new Credentials({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  })
})

export default sqs
