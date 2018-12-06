const log4js = require('log4js')
const escriba = require('escriba')
const { getEnv } = require('../../config/index')

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    test: { appenders: ['out'], level: 'OFF' }, // OFF must be uppercase
  },
})

const loggerCategory = getEnv() === 'test'
  ? 'test'
  : 'default'

const loggerEngine = log4js.getLogger(loggerCategory)

const { logger } = escriba({
  loggerEngine,
  service: 'sbwl',
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
    trace: makeLogFunction('trace'),
  }
}

const makeFromLogger = from => (defaultData = {}, defaultConfig = {}) => {
  Object.assign(defaultConfig, { from })

  return makeLogger(defaultData, defaultConfig)
}

module.exports = {
  logger,
  makeLogger,
  makeFromLogger,
}

