import Promise from 'bluebird'
import cuid from 'cuid'

export const defaultCuidValue = (prefix = '') => () => `${prefix}${cuid()}`

export const responseObjectBuilder = fn => data =>
  Array.isArray(data)
    ? Promise.map(data, fn)
    : Promise.resolve(fn(data))
