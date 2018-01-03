const { JSON } = require('sequelize')

module.exports = {
  up: queryInterface =>
    queryInterface.addColumn('Boletos', 'payer_address', {
      type: JSON,
    }),

  down: queryInterface =>
    queryInterface.removeColumn('Boletos', 'payer_address'),
}
