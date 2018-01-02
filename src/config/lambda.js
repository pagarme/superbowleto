import { getConfig } from './index'

const config = getConfig({
  development: {
    region: 'yopa-local',
    accessKeyId: 'x',
    secretAccessKey: 'x',
    sessionToken: 'x'
  },
  production: {
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  },
  test: {
    region: 'yopa-local',
    accessKeyId: 'x',
    secretAccessKey: 'x',
    sessionToken: 'x'
  }
})

export default config
