import Sequelize from 'sequelize'
import config from '../config/database'
import * as rawModels from '../models'

const database = new Sequelize(config)

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

export const { models } = database
export default database

