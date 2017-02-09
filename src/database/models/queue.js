import { STRING } from 'sequelize'
import { defaultCuidValue } from '../helpers/schema'

function create (database) {
  return database.define('queue', {
    id: {
      type: STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: defaultCuidValue('queue_')
    },

    name: {
      type: STRING
    },

    url: {
      type: STRING,
      allowNull: false
    }
  })
}

function associate (queue, { boleto }) {
  queue.hasMany(boleto)
}

export default {
  associate,
  create
}
