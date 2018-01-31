const Promise = require('bluebird')
const Umzug = require('umzug')
const { makeFromLogger } = require('../../lib/logger')
const database = require('../../database')
const { DatabaseError } = require('../../lib/errors')

const makeLogger = makeFromLogger('database/index')

const getMigrationsPath = () => {
  if (process.env.NODE_ENV === 'production') {
    return './dist/migrations'
  }

  return './src/database/migrations'
}

const migrate = (event, context, callback) => {
  const logger = makeLogger({ operation: 'migrate' })

  logger.info({ status: 'started' })

  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize: database,
    },
    migrations: {
      params: [
        database.getQueryInterface(),
        database.constructor,
      ],
      path: getMigrationsPath(),
      pattern: /\.js$/,
    },
  })

  umzug.up()
    .tap(() => logger.info({ status: 'success' }))
    .then(() => callback(null))
    .catch(err => callback(err))
    .catch((err) => {
      logger.error({
        status: 'failed',
        metadata: {
          error_name: err.name,
          error_stack: err.stack,
          error_message: err.message,
        },
      })
      callback(err)
    })
}

const ensureDatabaseIsConnected = (db) => {
  const MAX_RETRIES = 10
  const RETRY_TIMEOUT = 1000

  const tryToConnect = (retry = 1) =>
    db.authenticate()
      .catch((err) => {
        if (retry <= MAX_RETRIES) {
          return Promise.delay(RETRY_TIMEOUT)
            .then(() => tryToConnect(retry + 1))
        }

        return Promise.reject(new DatabaseError(err))
      })

  return tryToConnect()
}

module.exports = {
  ensureDatabaseIsConnected,
  migrate,
}
