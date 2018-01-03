const { prop } = require('ramda')
const { Queue } = require('sqs-quooler')
const sqs = require('../../lib/sqs')
const getConfig = require('../../config/queues')

const config = prop('boletos-to-register', getConfig())

const BoletosToRegisterQueue = new Queue({
  sqs,
  endpoint: config.queueUrl,
  concurrency: config.concurrency,
})

const BoletosToRegisterQueueUrl = config.queueUrl

module.exports = {
  BoletosToRegisterQueue,
  BoletosToRegisterQueueUrl,
}
