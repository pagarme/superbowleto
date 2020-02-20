const ddTrace = require('dd-trace')

const initInstrumentation = () => {
  if (process.env.NODE_ENV === 'production' && process.env.STAGE !== 'stg') {
    ddTrace.init({
      logInjection: true,
      runtimeMetrics: true,
    })

    if (process.env.NEWRELIC_KEY) {
      // eslint-disable-next-line global-require
      require('newrelic')
    }
  }
}

module.exports = initInstrumentation
