const { STRING } = require('sequelize')

module.exports = {
  up: queryInterface =>
    queryInterface.addColumn('Boletos', 'issuer_account', {
      type: STRING,
    }),

  down: queryInterface =>
    queryInterface.removeColumn('Boletos', 'issuer_account'),
}
