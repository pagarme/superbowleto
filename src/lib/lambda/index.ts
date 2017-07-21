import { Credentials, Lambda } from 'aws-sdk'

import getConfig from '../../config/lambda'

const config = getConfig()

const lambda = new Lambda({
  credentials: new Credentials({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  }),
  endpoint: config.endpoint,
  region: config.region
})

export default lambda
