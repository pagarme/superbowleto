const { STRING } = require('sequelize')

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('Boletos', 'company_name', {
      type: STRING,
      allowNull: true
    }
  ),

  down: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('Boletos', 'company_name', {
      type: STRING,
      allowNull: false
    }
  )
}
