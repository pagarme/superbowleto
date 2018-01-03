const {
  STRING, INTEGER, ENUM, TEXT, DATE,
} = require('sequelize')

module.exports = {
  up: queryInterface => queryInterface.createTable('Boletos', {
    id: {
      type: STRING,
      primaryKey: true,
      allowNull: false,
    },

    token: {
      type: STRING,
      allowNull: false,
    },

    queue_url: {
      type: STRING,
      allowNull: false,
    },

    status: {
      type: ENUM,
      allowNull: false,
      values: [
        'issued',
        'pending_registration',
        'registered',
        'refused',
      ],
      defaultValue: 'issued',
    },

    expiration_date: {
      type: DATE,
      allowNull: false,
    },

    amount: {
      type: INTEGER,
      allowNull: false,
    },

    paid_amount: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    instructions: {
      type: TEXT,
    },

    issuer: {
      type: STRING,
      allowNull: false,
    },

    issuer_id: {
      type: STRING,
    },

    title_id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
    },

    reference_id: {
      type: STRING,
    },

    barcode: {
      type: STRING,
    },

    payer_name: {
      type: STRING,
    },

    payer_document_type: {
      type: ENUM,
      values: ['cpf', 'cnpj'],
    },

    payer_document_number: {
      type: STRING,
    },

    company_name: {
      type: STRING,
      allowNull: false,
    },

    company_document_number: {
      type: STRING,
      allowNull: false,
    },

    bank_response_code: {
      type: STRING,
    },

    created_at: {
      type: DATE,
      allowNull: false,
    },

    updated_at: {
      type: DATE,
      allowNull: false,
    },
  })
    .then(() => queryInterface.addIndex('Boletos', ['queue_url']))
    .then(() => queryInterface.addIndex('Boletos', ['status'])),

  down: queryInterface => queryInterface.dropTable('Boletos'),
}
