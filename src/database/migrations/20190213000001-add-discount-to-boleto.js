const { JSON } = require('sequelize')

module.exports = {
  up: queryInterface =>
    queryInterface.addColumn('Boletos', 'discount', {
      type: JSON,
    }),

  down: queryInterface =>
    queryInterface.removeColumn('Boletos', 'discount'),
}
