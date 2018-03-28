const dotenv = require('dotenv')
const BoletoService = require('../resources/boleto/service')
const { BoletosToRegisterQueue } = require('../resources/boleto/queues')
const { defaultCuidValue } = require('../lib/database/schema')
const { makeFromLogger } = require('../lib/logger')

const makeLogger = makeFromLogger('boleto/worker')

const queueItemId = defaultCuidValue('qi_')()
const service = BoletoService({ operationId: queueItemId })

if (process.env.NODE_ENV === 'production' && process.env.DOTENV_PATH) {
  dotenv.config({ path: process.env.DOTENV_PATH })
}

const logger = makeLogger(
  { operation: 'process_background_queue' },
  { id: queueItemId }
)

BoletosToRegisterQueue.on('error', (err) => {
  logger.error({
    status: 'failed',
    metadata: {
      error_name: err.name,
      error_stack: err.stack,
      error_message: err.message,
    },
  })
})

BoletosToRegisterQueue.startProcessing(service.processBoleto, {
  keepMessages: true,
})

console.log('Superbowleto worker is up')
