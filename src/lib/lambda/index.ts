import { Lambda, Credentials } from 'aws-sdk'

import getConfig from '../../config/lambda'

const config = getConfig()

const lambda = new Lambda({
  region: config.region,
  endpoint: config.endpoint,
  credentials: new Credentials({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  })
})

export default lambda
