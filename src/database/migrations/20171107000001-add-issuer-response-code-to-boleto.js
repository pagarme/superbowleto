const { STRING } = require('sequelize')

module.exports = {
  up: queryInterface =>
    queryInterface.addColumn('Boletos', 'issuer_response_code', {
      type: STRING,
    }),

  down: queryInterface =>
    queryInterface.removeColumn('Boletos', 'issuer_response_code'),
}
