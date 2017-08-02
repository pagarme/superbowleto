import { STRING } from 'sequelize'

export default {
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
