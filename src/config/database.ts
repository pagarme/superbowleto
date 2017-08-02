import { getConfig } from './index'

const config = getConfig({
  development: {
    host: process.env.DB_HOST || 'postgres',
    dialect: 'postgres',
    database: 'postgres',
    username: 'postgres',
    logging: true,
    port: process.env.DB_PORT || '5432'
  },
  production: {
    host: process.env.DATABASE_ENDPOINT,
    dialect: 'postgres',
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    logging: false
  },
  test: {
    host: process.env.DB_HOST || 'postgres',
    dialect: 'postgres',
    database: 'postgres',
    username: 'postgres',
    logging: false,
    port: process.env.DB_PORT || '5432'
  }
})

export default config
