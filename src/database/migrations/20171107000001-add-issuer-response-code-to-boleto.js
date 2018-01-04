import { STRING } from 'sequelize'

export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Boletos', 'issuer_response_code', {
      type: STRING
    }
  ),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('Boletos', 'issuer_response_code')
}
