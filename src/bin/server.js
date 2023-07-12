const bootstrap = require('../lib/bootstrap')
const instrumentation = require('../lib/instrumentation')

bootstrap()
instrumentation()

const { DatabaseError } = require('../lib/errors')
const database = require('../database')
const { ensureDatabaseIsConnected } = require('../functions/database')
const application = require('../server')
const { setupGracefulShutdown } = require('../server/shutdown')
const { makeLogger } = require('../lib/logger')

const { PORT = 3000 } = process.env

const startServer = (app) => {
  const server = app.listen(PORT)

  server.keepAliveTimeout = 65 * 1000
  server.headersTimeout = 66 * 1000

  return server
}

const handleInitializationErrors = (err) => {
  const logger = makeLogger()
  const isDatabaseError = err instanceof DatabaseError

  logger.error({
    message: 'Initialization failed',
    metadata: {
      error_message: err.message,
      error_description: isDatabaseError ? 'Error on database connection' : 'Unknown error',
      error_stack: err.stack ? err.stack.split('\n') : null,
    },
  })

  return process.exit(1)
}

const initializeApplication = (app, db) =>
  ensureDatabaseIsConnected(db)
    .then(() => startServer(app))
    .then(setupGracefulShutdown(process))
    .catch(handleInitializationErrors)

initializeApplication(application, database)
