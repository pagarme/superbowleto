const { JSON } = require('sequelize')

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Boletos', 'payer_address', {
      type: JSON
    }
  ),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('Boletos', 'payer_address')
}
