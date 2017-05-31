import { prop } from 'ramda'

export const getEnv = env => env || process.env.NODE_ENV || 'test'

export const getConfig = config => env => prop(getEnv(env), config)
