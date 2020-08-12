const {
  ARRAY,
  TEXT,
} = require('sequelize')

module.exports = {
  up: queryInterface =>
    queryInterface.addColumn('Boletos', 'rules', {
      type: ARRAY(TEXT),
    }),

  down: queryInterface =>
    queryInterface.removeColumn('Boletos', 'rules'),
}
