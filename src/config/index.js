import { prop } from 'ramda'

export const getEnv = (env?: string) => env || process.env.NODE_ENV || 'test'

export const getConfig = config => (env?: string) => prop(getEnv(env), config)
