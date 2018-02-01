const BoletoService = require('../resources/boleto/service')
const { BoletosToRegisterQueue } = require('../resources/boleto/queues')
const { defaultCuidValue } = require('../lib/database/schema')
const { makeFromLogger } = require('../lib/logger')

const makeLogger = makeFromLogger('boleto/worker')

const queueItemId = defaultCuidValue('qi_')()
const service = BoletoService({ operationId: queueItemId })

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
