import * as Promise from 'bluebird'
import { Boleto as NodeBoleto } from 'node-boleto'
import { DATE, ENUM, INTEGER, STRING, TEXT } from 'sequelize'
import { defaultCuidValue, responseObjectBuilder } from '../../lib/database/schema'

export const generateBarcode = (boleto) => {
  const nodeBoleto = new NodeBoleto({
    banco: boleto.issuer,
    valor: boleto.amount,
    nosso_numero: boleto.title_id,
    data_vencimento: boleto.expiration_date,
    agencia: '1229',
    codigo_cedente: '469',
    carteira: '25'
  })

  return nodeBoleto.barcode_data
}

export const buildModelResponse = responseObjectBuilder(boleto =>
  Promise.resolve(boleto)
    .then(pick([
      'id',
      'token',
      'queue_url',
      'status',
      'expiration_date',
      'amount',
      'paid_amount',
      'instructions',
      'issuer',
      'issuer_id',
      'title_id',
      'barcode',
      'payer_name',
      'payer_document_type',
      'payer_document_number',
      'company_name',
      'company_document_number',
      'bank_response_code',
      'created_at',
      'updated_at'
    ]))
    .then(assoc('object', 'boleto'))
)

const addBarcode = boleto =>
  boleto.updateAttributes({
    barcode: generateBarcode(boleto)
  })

function create (database) {
  return database.define('Boleto', {
    id: {
      type: STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: defaultCuidValue('bol_')
    },

    token: {
      type: STRING,
      allowNull: false,
      defaultValue: defaultCuidValue(`${process.env.STAGE}_`)
    },

    // tslint:disable-next-line:object-literal-sort-keys
    queue_url: {
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

    barcode: {
      type: STRING
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
    },

    company_name: {
      type: STRING,
      allowNull: false
    },

    company_document_number: {
      type: STRING,
      allowNull: false
    },

    bank_response_code: {
      type: STRING
    }
  // tslint:disable-next-line:align
  }, {
    indexes: [
      { fields: ['queue_url'] },
      { fields: ['status'] }
    ],
    hooks: {
      afterCreate: addBarcode
    }
  })
}

export default {
  create
}
