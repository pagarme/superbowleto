import { path } from 'ramda'
import rawConfig from '../../config/queues.json'
import Queue from '../../lib/sqs/Queue'

const env = process.env.NODE_ENV || 'test'
const config = path([env, 'boletos-to-register'], rawConfig)

export const BoletosToRegisterQueue = new Queue({
  queueUrl: config.queueUrl,
  concurrency: config.concurrency
})
