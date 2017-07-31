import { STRING } from 'sequelize'

export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Boletos', 'issuer_agency', {
      type: STRING
    }
  ),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('Boletos', 'issuer_agency')
}
