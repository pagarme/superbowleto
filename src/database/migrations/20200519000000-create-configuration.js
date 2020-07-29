const {
  STRING,
  DATE,
} = require('sequelize')

module.exports = {
  up: queryInterface => queryInterface.createTable('Configurations', {
    id: {
      type: STRING,
      primaryKey: true,
      allowNull: false,
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

    created_at: {
      type: DATE,
      allowNull: false,
    },

    updated_at: {
      type: DATE,
      allowNull: false,
    },
  }),
  down: queryInterface => queryInterface.dropTable('Configurations'),
}
