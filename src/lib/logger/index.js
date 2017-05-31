import log4js from 'log4js'
import escriba from 'escriba'
import { getEnv } from '../../config/index'

if (getEnv() === 'test') {
  log4js.setGlobalLogLevel('OFF')
}

const loggerEngine = log4js.getLogger()

export const { logger } = escriba({
  loggerEngine,
  service: 'superbowleto'
})

export const makeLogger = (defaultData = {}, defaultConfig = {}) => {
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

export const makeFromLogger = from => (defaultData = {}, defaultConfig = {}) => {
  Object.assign(defaultConfig, { from })

  return makeLogger(defaultData, defaultConfig)
}

