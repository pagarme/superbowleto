import { getConfig } from './index'

const config = getConfig({
  development: {
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || '5432',
    dialect: 'postgres',
    database: 'postgres',
    username: 'postgres',
    logging: true
  },
  production: {
    host: 'HOST',
    dialect: 'postgres',
    database: 'DATABASE',
    username: 'USERNAME',
    logging: false
  },
  test: {
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || '5432',
    dialect: 'postgres',
    database: 'postgres',
    username: 'postgres',
    logging: false
  }
})

export default config
