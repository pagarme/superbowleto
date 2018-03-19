const dotenv = require('dotenv')
const { DatabaseError } = require('../lib/errors')
const database = require('../database')
const { ensureDatabaseIsConnected } = require('../functions/database')
const application = require('../server')
const { setupGracefulShutdown } = require('../server/shutdown')

const { PORT = 3000 } = process.env

const startServer = app => app.listen(PORT)

if (process.env.NODE_ENV === 'production' && process.env.DOTENV_PATH) {
  dotenv.config({ path: process.env.DOTENV_PATH })
}

const handleInitializationErrors = (err) => {
  if (err instanceof DatabaseError) {
    console.log(`Initialization failed with connection to database: ${err}`)
    return process.exit(1)
  }

  console.log(`Unknown error: ${err}`)
  return process.exit(1)
}

const initializeApplication = (app, db) =>
  ensureDatabaseIsConnected(db)
    .then(() => startServer(app))
    .then(setupGracefulShutdown(process))
    .catch(handleInitializationErrors)

initializeApplication(application, database)
