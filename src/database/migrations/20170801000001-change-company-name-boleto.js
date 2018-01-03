const { STRING } = require('sequelize')

module.exports = {
  up: queryInterface =>
    queryInterface.changeColumn('Boletos', 'company_name', {
      type: STRING,
      allowNull: true,
    }),

  down: queryInterface =>
    queryInterface.changeColumn('Boletos', 'company_name', {
      type: STRING,
      allowNull: false,
    }),
}
