const { JSON } = require('sequelize')

module.exports = {
  up: queryInterface =>
    queryInterface.addColumn('Boletos', 'company_address', {
      type: JSON,
    }),

  down: queryInterface =>
    queryInterface.removeColumn('Boletos', 'company_address'),
}
