const log4js = require('log4js')
const escriba = require('escriba')
const { dissoc, prop } = require('ramda')
const { getEnv } = require('../../config/index')

const jsonLayout = () =>
  logEvent =>
    logEvent.data.map((data) => {
      const dataObj = JSON.parse(data)
      const dd = prop('dd', dataObj)
      const dataWithoutDD = dissoc('dd', dataObj)
      return JSON.stringify({
        time: logEvent.startTime,
        level: logEvent.level.levelStr,
        category: logEvent.categoryName,
        dd,
        data: dataWithoutDD,
      })
    })
      .join('\n')

log4js.addLayout('json', jsonLayout)

log4js.configure({
  appenders: {
    out: {
      type: 'stdout',
      layout: { type: 'json' },
    },
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'info',
    },
  },
})

const loggerCategory = getEnv() === 'test'
  ? 'test'
  : 'default'

const loggerEngine = log4js.getLogger(loggerCategory)

const { logger } = escriba({
  loggerEngine,
  service: 'superbowleto',
  integrations: {
    datadog: true,
  },
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

