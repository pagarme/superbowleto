const ddTrace = require('dd-trace')
const { getCredentials } = require('../credentials')
const { makeFromLogger } = require('../../lib/logger')

const makeLogger = makeFromLogger('lib/instrumentation')

const initializeInstrumentation = () => {
  if (process.env.NODE_ENV !== 'production') {
    return false
  }

  const logger = makeLogger({ operation: 'instrumentation' })

  if (process.env.NEWRELIC_KEY) {
    // eslint-disable-next-line global-require
    require('newrelic')
  }

  return getCredentials('datadog/endpoint')
    .then(datadogEndpoint =>
      ddTrace.init({
        hostname: datadogEndpoint,
        port: 8126,
      }))
    .catch((err) => {
      logger.error({
        status: 'failed',
        metadata: {
          error_name: err.name,
          error_stack: err.stack,
          error_message: err.message,
        },
      })
    })
}

module.exports = initializeInstrumentation
