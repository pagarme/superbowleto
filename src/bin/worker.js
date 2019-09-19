const bootstrap = require('../lib/bootstrap')
const instrumentation = require('../lib/instrumentation')

bootstrap()
instrumentation()

const { DatabaseError } = require('../lib/errors')
const database = require('../database')
const { ensureDatabaseIsConnected } = require('../functions/database')
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

const startWorker = () => {
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
}

const handleInitializationErrors = (err) => {
  if (err instanceof DatabaseError) {
    console.log(`Initialization failed with connection to database: ${err}`)
    return process.exit(1)
  }

  console.log(`Unknown error: ${err}`)
  return process.exit(1)
}

const initializeApplication = db =>
  ensureDatabaseIsConnected(db)
    .tap(() => startWorker())
    .catch(handleInitializationErrors)

initializeApplication(database)
