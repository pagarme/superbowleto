import { getConfig } from './index'

const config = getConfig({
  development: {
    endpoint: `http://${process.env.LAMBDA_HOST || 'yopa'}:47195`,
    region: 'yopa-local',
    accessKeyId: 'x',
    secretAccessKey: 'x'
  },
  production: {
    endpoint: 'sqs.us-east-1.amazonaws.com',
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  test: {
    endpoint: `http://${process.env.LAMBDA_HOST || 'yopa'}:47195`,
    region: 'yopa-local',
    accessKeyId: 'x',
    secretAccessKey: 'x'
  }
})

export default config
