import { getConfig } from './index'

const config = getConfig({
  development: {
    database: 'postgres',
    dialect: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    logging: true,
    port: process.env.DB_PORT || '5432',
    username: 'postgres'
  },
  production: {
    database: process.env.DATABASE_NAME,
    dialect: 'postgres',
    host: process.env.DATABASE_ENDPOINT,
    logging: false,
    username: process.env.DATABASE_USERNAME
  },
  test: {
    database: 'postgres',
    dialect: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    logging: false,
    port: process.env.DB_PORT || '5432',
    username: 'postgres'
  }
})

export default config
