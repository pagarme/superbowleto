import cuid from 'cuid'

export const defaultCuidValue = (prefix = '') => () => `${prefix}${cuid()}`
