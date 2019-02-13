const { JSON } = require('sequelize')

module.exports = {
  up: queryInterface =>
    queryInterface.addColumn('Boletos', 'interest', {
      type: JSON,
    }),

  down: queryInterface =>
    queryInterface.removeColumn('Boletos', 'interest'),
}
