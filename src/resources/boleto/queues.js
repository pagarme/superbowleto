import { path } from 'ramda'
import { Queue } from 'sqs-quooler'
import sqs from '../../lib/sqs'
import rawConfig from '../../config/queues.json'

const env = process.env.NODE_ENV || 'test'
const config = path([env, 'boletos-to-register'], rawConfig)

export const BoletosToRegisterQueue = new Queue({
  sqs,
  endpoint: config.queueUrl,
  concurrency: config.concurrency
})

