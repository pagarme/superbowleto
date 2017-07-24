import * as Umzug from 'umzug'
import { makeFromLogger } from '../../lib/logger'
import { getDatabase } from '../../database'

const makeLogger = makeFromLogger('database/index')

const getMigrationsPath = () => {
  if (process.env.NODE_ENV === 'production') {
    return './dist/migrations'
  }

  return './build/database/migrations'
}

export const migrate = (event, context, callback) => {
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
      .tap(() => logger.info({ status: 'succeeded' }))
      .then(() => callback(null))
      .catch(err => callback(err))
      .catch((err) => {
        logger.error({ status: 'failed', metadata: { err } })
        callback(err)
      })
  })
}
