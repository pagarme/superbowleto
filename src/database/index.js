import Sequelize from 'sequelize'
import config from '../config/database'
import * as rawModels from './models'

const defaults = {
  define: {
    underscored: true
  }
}

const database = new Sequelize(Object.assign({}, defaults, config))

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
