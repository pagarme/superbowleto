import Sequelize from 'sequelize'
import config from '../config/database.json'
import * as rawModels from './models'

const env = process.env.NODE_ENV || 'test'

const defaults = {
  define: {
    underscored: true
  }
}

const database = new Sequelize(Object.assign({}, defaults, config[env]))

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
