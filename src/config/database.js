const { getConfig } = require('./index')

const config = getConfig({
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || '5432',
    database: 'postgres',
    username: 'postgres',
    password: 'touchdown1!',
    logging: false,
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: false,
  },
  test: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || '5432',
    database: 'postgres',
    username: 'postgres',
    password: 'touchdown1!',
    logging: false,
  },
})

module.exports = config
