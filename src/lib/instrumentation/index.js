const ddTrace = require('dd-trace')

const initInstrumentation = () => {
  if (process.env.NODE_ENV === 'production' && process.env.APP_ENV !== 'stg') {
    ddTrace.init({
      logInjection: true,
      runtimeMetrics: true,
    })

    if (process.env.NEWRELIC_KEY && process.env.NEWRELIC_KEY !== 'REDACTED') {
      // eslint-disable-next-line global-require
      require('newrelic')
    }
  }
}

module.exports = initInstrumentation
