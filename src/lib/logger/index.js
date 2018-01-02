const log4js = require('log4js')
const escriba = require('escriba')
const { getEnv } = require('../../config/index')

if (getEnv() === 'test') {
  log4js.setGlobalLogLevel('OFF')
}

const loggerEngine = log4js.getLogger()

const { logger } = escriba({
  loggerEngine,
  service: 'superbowleto'
})

const makeLogger = (defaultData = {}, defaultConfig = {}) => {
  function makeLogFunction (name) {
    return (data = {}, config = {}) => {
      const mergedData = Object.assign({}, defaultData, data)
      const mergedConfig = Object.assign({}, defaultConfig, config)

      logger[name](mergedData, mergedConfig)
    }
  }

  return {
    info: makeLogFunction('info'),
    warn: makeLogFunction('warn'),
    error: makeLogFunction('error'),
    debug: makeLogFunction('debug'),
    fatal: makeLogFunction('fatal'),
    trace: makeLogFunction('trace')
  }
}

const makeFromLogger = from => (defaultData = {}, defaultConfig = {}) => {
  Object.assign(defaultConfig, { from })

  return makeLogger(defaultData, defaultConfig)
}

module.exports = {
  logger,
  makeLogger,
  makeFromLogger
}

