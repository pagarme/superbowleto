const { STRING } = require('sequelize')

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Boletos', 'digitable_line', {
      type: STRING
    }
  ),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('Boletos', 'digitable_line')
}
