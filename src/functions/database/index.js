const Umzug = require('umzug')
const { makeFromLogger } = require('../../lib/logger')
const { getDatabase } = require('../../database')

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

  getDatabase().then((database) => {
    const umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize: database
      },
      migrations: {
        params: [
          database.getQueryInterface(),
          database.constructor
        ],
        path: getMigrationsPath(),
        pattern: /\.js$/
      }
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
            error_message: err.message
          }
        })
        callback(err)
      })
  })
}

module.exports = {
  migrate
}
