const { prop } = require('ramda')

const getEnv = (env?: string) => env || process.env.NODE_ENV || 'test'
const getConfig = config => (env?: string) => prop(getEnv(env), config)

module.exports = {
  getEnv,
  getConfig
}
