const Promise = require('bluebird')
const { DatabaseError } = require('../../lib/errors')

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
}
