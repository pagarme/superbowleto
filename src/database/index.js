const Sequelize = require('sequelize')
const Promise = require('bluebird')
const getConfig = require('../config/database')
const rawModels = require('./models')
const { getCredentials } = require('../lib/credentials')

const config = getConfig()

const defaults = {
  define: {
    underscored: true,
  },
}

let database = null

function getDatabase () {
  if (database) {
    return Promise.resolve(database)
  }

  return getCredentials('database/password')
    .then((password) => {
      database = new Sequelize(Object.assign({}, defaults, config, {
        password,
      }))

      const createInstance = model => ({
        model,
        instance: model.create(database),
      })

      const associateModels = ({ model, instance }) => {
        if (model.associate) {
          model.associate(instance, database.models)
        }
      }

      Object.values(rawModels)
        .map(createInstance)
        .map(associateModels)

      return database
    })
}

function getModel (modelName) {
  return getDatabase()
    .then(returnedDatabase => returnedDatabase.models[modelName])
}

module.exports = {
  getDatabase,
  getModel,
}
