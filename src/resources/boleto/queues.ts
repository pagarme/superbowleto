import { prop } from 'ramda'
import { Queue } from 'sqs-quooler'
import getConfig from '../../config/queues'
import sqs from '../../lib/sqs'

const config = prop('boletos-to-register', getConfig())

export const BoletosToRegisterQueue = new Queue({
  concurrency: config.concurrency,
  endpoint: config.queueUrl,
  sqs
})

export const BoletosToRegisterQueueUrl = config.queueUrl
