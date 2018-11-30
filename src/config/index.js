const { prop } = require('ramda')

const { initializeDotEnv } = require('../lib/instrumentation')

initializeDotEnv()

const getEnv = env => env || process.env.NODE_ENV || 'test'
const getConfig = (config, env) => prop(getEnv(env), config)

module.exports = {
  getEnv,
  getConfig,
}
