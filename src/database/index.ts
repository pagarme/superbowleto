import Sequelize from 'sequelize'
import * as Promise from 'bluebird'
import getConfig from '../config/database'
import * as rawModels from './models'
import { getDatabasePassword } from '../lib/credentials'

const config = getConfig()

const defaults = {
  define: {
    underscored: true
  }
}

let database = null

export function getDatabase () {
  if (database) {
    return Promise.resolve(database)
  }

  return getDatabasePassword().then((password) => {
    database = new Sequelize(Object.assign({}, defaults, config, {
      password
    }))

    const createInstance = model => ({
      model,
      instance: model.create(database)
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

export function getModel (modelName) {
  return getDatabase()
    .then(returnedDatabase => returnedDatabase.models[modelName])
}
