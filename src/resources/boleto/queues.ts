import { prop } from 'ramda'
import { Queue } from 'sqs-quooler'
import sqs from '../../lib/sqs'
import getConfig from '../../config/queues'

const config = prop('boletos-to-register', getConfig())

console.log(config)

export const BoletosToRegisterQueue = new Queue({
  sqs,
  endpoint: config.queueUrl,
  concurrency: config.concurrency
})

export const BoletosToRegisterQueueUrl = config.queueUrl

