import Promise from 'bluebird'
import { assoc, pick } from 'ramda'
import { STRING, INTEGER, ENUM, TEXT, DATE } from 'sequelize'
import { defaultCuidValue, responseObjectBuilder } from '../../lib/database/schema'

export const buildResponse = responseObjectBuilder(boleto =>
  Promise.resolve(boleto)
    .then(pick([
      'id',
      'queue_id',
      'status',
      'expiration_date',
      'amount',
      'paid_amount',
      'instructions',
      'issuer',
      'issuer_id',
      'title_id',
      'payer_name',
      'payer_document_type',
      'payer_document_number',
      'created_at',
      'updated_at'
    ]))
    .then(assoc('object', 'boleto'))
)

function create (database) {
  return database.define('Boleto', {
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
      values: [
        'issued',
        'pending_registration',
        'registered',
        'refused'
      ],
      defaultValue: 'issued'
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
      type: STRING
    },

    payer_document_type: {
      type: ENUM,
      values: ['cpf', 'cnpj']
    },

    payer_document_number: {
      type: STRING
    }
  }, {
    indexes: [
      { fields: ['queue_id'] },
      { fields: ['status'] }
    ],
    classMethods: {
      buildResponse
    }
  })
}

function associate (Boleto, { Queue }) {
  Boleto.belongsTo(Queue)
}

export default {
  associate,
  create
}
