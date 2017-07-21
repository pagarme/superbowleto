// tslint:disable:variable-name
import { prop } from 'ramda'
import { Queue } from 'sqs-quooler'
import getConfig from '../../config/queues'
import sqs from '../../lib/sqs'

const config = prop('boletos-to-register', getConfig())

export const BoletosToRegisterQueue = new Queue({
  sqs,
  endpoint: config.queueUrl,
  concurrency: config.concurrency
})

export const BoletosToRegisterQueueUrl = config.queueUrl
