import { STRING } from 'sequelize'

export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Boletos', 'digitable_line', {
      type: STRING
    }
  ),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('Boletos', 'digitable_line')
}
