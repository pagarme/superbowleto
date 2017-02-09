import { STRING, INTEGER, ENUM, TEXT, DATE } from 'sequelize'
import { defaultCuidValue } from '../helpers/schema'

function create (database) {
  return database.define('boleto', {
    id: {
      type: STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: defaultCuidValue('bol_')
    },

    queue_id: {
      type: STRING,
      allowNull: false
    },

    status: {
      type: ENUM,
      allowNull: false,
      values: ['pending_registration', 'registered'],
      defaultValue: 'pending_registration'
    },

    expiration_date: {
      type: DATE,
      allowNull: false
    },

    amount: {
      type: INTEGER,
      allowNull: false
    },

    paid_amount: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    instructions: {
      type: TEXT
    },

    issuer: {
      type: STRING,
      allowNull: false
    },

    issuer_id: {
      type: STRING
    },

    title_id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true
    },

    payer_name: {
      type: STRING,
      allowNull: false
    },

    payer_document_type: {
      type: ENUM,
      allowNull: false,
      values: ['cpf', 'cnpj'],
      defaultValue: 'cpf'
    },

    payer_document_number: {
      type: STRING,
      allowNull: false
    }
  }, {
    indexes: [
      { fields: ['queue_id'] },
      { fields: ['status'] }
    ]
  })
}

function associate (boleto, { queue }) {
  boleto.belongsTo(queue)
}

export default {
  associate,
  create
}
