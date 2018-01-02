const { getConfig } = require('./index')

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
    host: process.env.DATABASE_ENDPOINT,
    dialect: 'postgres',
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
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

module.exports = config
