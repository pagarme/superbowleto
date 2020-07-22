const {
  assoc,
  pick,
} = require('ramda')
const {
  STRING,
} = require('sequelize')

const {
  defaultCuidValue,
  responseObjectBuilder,
} = require('../../lib/database/schema')

const buildModelResponse = responseObjectBuilder(configuration =>
  Promise.resolve(configuration)
    .then(pick([
      'id',
      'external_id',
      'issuer_account',
      'issuer_agency',
      'issuer_wallet',
      'issuer',
      'created_at',
      'updated_at',
    ]))
    .then(assoc('object', 'configuration')))

function create (database) {
  return database.define('Configuration', {
    id: {
      type: STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: defaultCuidValue('cf_'),
    },

    external_id: {
      type: STRING,
      allowNull: false,
      unique: true,
    },

    issuer_account: {
      type: STRING,
      allowNull: false,
    },

    issuer_agency: {
      type: STRING,
      allowNull: false,
    },

    issuer_wallet: {
      type: STRING,
      allowNull: false,
    },

    issuer: {
      type: STRING,
      allowNull: false,
    },
  }, {
    indexes: [
      { fields: ['external_id'] },
      { fields: ['issuer'] },
    ],
  })
}

module.exports = {
  buildModelResponse,
  create,
}
