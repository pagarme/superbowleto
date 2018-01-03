const Promise = require('bluebird')
const cuid = require('cuid')

const defaultCuidValue = (prefix = '') => () => `${prefix}${cuid()}`

const responseObjectBuilder = fn => data =>
  (Array.isArray(data)
    ? Promise.map(data, fn)
    : Promise.resolve(fn(data)))

module.exports = {
  defaultCuidValue,
  responseObjectBuilder,
}
