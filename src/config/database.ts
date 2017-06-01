import { getConfig } from './index'

const config = getConfig({
  development: {
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || '5432',
    dialect: 'postgres',
    database: 'postgres',
    username: 'postgres',
    password: 'touchdown1!',
    logging: true
  },
  production: {
    host: 'HOST',
    dialect: 'postgres',
    database: 'DATABASE',
    username: 'USERNAME',
    password: 'PASSWORD',
    logging: false
  },
  test: {
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || '5432',
    dialect: 'postgres',
    database: 'postgres',
    username: 'postgres',
    password: 'touchdown1!',
    logging: false
  }
})

export default config
