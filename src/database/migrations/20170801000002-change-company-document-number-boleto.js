const { STRING } = require('sequelize')

module.exports = {
  up: queryInterface =>
    queryInterface.changeColumn('Boletos', 'company_document_number', {
      type: STRING,
      allowNull: true,
    }),

  down: queryInterface =>
    queryInterface.changeColumn('Boletos', 'company_document_number', {
      type: STRING,
      allowNull: false,
    }),
}
