import * as Promise from 'bluebird'
import { Boleto as NodeBoleto } from 'node-boleto'
import { assoc, pick } from 'ramda'
import { DATE, ENUM, INTEGER, STRING, TEXT } from 'sequelize'
import { defaultCuidValue, responseObjectBuilder } from '../../lib/database/schema'

export const generateBarcode = (boleto) => {
  const nodeBoleto = new NodeBoleto({
    agencia: '1229',
    banco: boleto.issuer,
    carteira: '25',
    codigo_cedente: '469',
    data_vencimento: boleto.expiration_date,
    nosso_numero: boleto.title_id,
    valor: boleto.amount
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
      allowNull: false,
      defaultValue: defaultCuidValue('bol_'),
      primaryKey: true,
      type: STRING
    },

    token: {
      allowNull: false,
      defaultValue: defaultCuidValue(`${process.env.STAGE}_`),
      type: STRING
    },

    // tslint:disable-next-line:object-literal-sort-keys
    queue_url: {
      allowNull: false,
      type: STRING
    },

    status: {
      allowNull: false,
      defaultValue: 'issued',
      type: ENUM,
      values: [
        'issued',
        'pending_registration',
        'registered',
        'refused'
      ]
    },

    expiration_date: {
      allowNull: false,
      type: DATE
    },

    amount: {
      allowNull: false,
      type: INTEGER
    },

    paid_amount: {
      allowNull: false,
      defaultValue: 0,
      type: INTEGER
    },

    instructions: {
      type: TEXT
    },

    issuer: {
      allowNull: false,
      type: STRING
    },

    issuer_id: {
      type: STRING
    },

    title_id: {
      allowNull: false,
      autoIncrement: true,
      type: INTEGER
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
      allowNull: false,
      type: STRING
    },

    company_document_number: {
      allowNull: false,
      type: STRING
    },

    bank_response_code: {
      type: STRING
    }
  }, {
      hooks: {
        afterCreate: addBarcode
      },
      indexes: [
        { fields: ['queue_url'] },
        { fields: ['status'] }
      ]
    })
}

export default {
  create
}
