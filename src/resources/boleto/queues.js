const { prop } = require('ramda')
const { Queue } = require('sqs-quooler')
const sqs = require('../../lib/sqs')
const config = require('../../config/queues')

const { queueUrl, concurrency } = prop('boletos-to-register', config)

const BoletosToRegisterQueue = new Queue({
  sqs,
  endpoint: queueUrl,
  concurrency,
})

const BoletosToRegisterQueueUrl = queueUrl

module.exports = {
  BoletosToRegisterQueue,
  BoletosToRegisterQueueUrl,
}
