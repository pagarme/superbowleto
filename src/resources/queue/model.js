import Promise from 'bluebird'
import { assoc, pick } from 'ramda'
import { STRING } from 'sequelize'
import { defaultCuidValue, responseObjectBuilder } from '../../lib/schema'

export const buildResponse = responseObjectBuilder(queue =>
  Promise.resolve(queue)
    .then(pick([
      'id',
      'name',
      'url',
      'created_at',
      'updated_at'
    ]))
    .then(assoc('object', 'queue'))
)

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
  }, {
    classMethods: {
      buildResponse
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
