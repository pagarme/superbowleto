const { STRING } = require('sequelize')

module.exports = {
  up: queryInterface =>
    queryInterface.addColumn('Boletos', 'useless_field', {
      type: STRING,
    }),

  down: queryInterface =>
    queryInterface.removeColumn('Boletos', 'useless_field'),
}
