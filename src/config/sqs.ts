import { getConfig } from './'

const config = getConfig({
  development: {
    accessKeyId: 'x',
    endpoint: `http://${process.env.SQS_HOST || 'yopa'}:47195`,
    region: 'yopa-local',
    secretAccessKey: 'x'
  },
  production: {
    accessKeyId: 'ACCESS_KEY_ID',
    endpoint: 'sqs.us-east-1.amazonaws.com',
    region: 'us-east-1',
    secretAccessKey: 'SECRET_ACCESS_KEY'
  },
  test: {
    accessKeyId: 'x',
    endpoint: `http://${process.env.SQS_HOST || 'yopa'}:47195`,
    region: 'yopa-local',
    secretAccessKey: 'x'
  }
})

export default config
