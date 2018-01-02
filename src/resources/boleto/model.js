import * as Promise from 'bluebird'
import {
  __,
  T,
  all,
  always,
  assoc,
  both,
  complement,
  cond,
  equals,
  has,
  identity,
  ifElse,
  intersection,
  isNil,
  keys,
  map,
  pipe,
  pick,
  values
} from 'ramda'

import { STRING, INTEGER, ENUM, TEXT, DATE, JSON } from 'sequelize'
import { Boleto as NodeBoleto } from 'node-boleto'
import { defaultCuidValue, responseObjectBuilder } from '../../lib/database/schema'

const barcodeBank = cond([
  [equals('development'), always('bradesco')],
  [T, identity]
])

export const generateBoletoCode = (boleto) => {
  const nodeBoleto = new NodeBoleto({
    banco: barcodeBank(boleto.issuer),
    valor: boleto.amount,
    nosso_numero: boleto.title_id,
    data_vencimento: boleto.expiration_date,
    agencia: boleto.issuer_agency,
    codigo_cedente: boleto.issuer_account,
    carteira: boleto.issuer_wallet
  })

  return {
    barcode: nodeBoleto.barcode_data,
    digitable_line: nodeBoleto.linha_digitavel
  }
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
      'issuer_account',
      'issuer_agency',
      'issuer_wallet',
      'issuer_id',
      'issuer_response_code',
      'title_id',
      'barcode',
      'digitable_line',
      'payer_name',
      'payer_document_type',
      'payer_document_number',
      'payer_address',
      'company_name',
      'company_document_number',
      'bank_response_code',
      'reference_id',
      'created_at',
      'updated_at'
    ]))
    .then(assoc('object', 'boleto'))
)

const addBoletoCode = (boleto) => {
  const { barcode, digitable_line } = generateBoletoCode(boleto)

  boleto.updateAttributes({
    barcode,
    digitable_line
  })
}

export const validateModel = (boleto) => {
  if (!boleto.payer_address) {
    boleto.payer_address = {}
  }

  const defaultAddress = {
    zipcode: '04551010',
    street: 'Rua Fidêncio Ramos',
    street_number: '308',
    complementary: '9º andar, conjunto 91',
    neighborhood: 'Vila Olímpia',
    city: 'São Paulo',
    state: 'SP'
  }

  const requiredAddressFields = [
    'zipcode',
    'street',
    'street_number',
    'neighborhood',
    'city',
    'state'
  ]

  const hasAllRequiredFields = pipe(
    keys,
    intersection(requiredAddressFields),
    equals(requiredAddressFields)
  )

  const isNotNil = complement(isNil)

  const hasNoNilValues = pipe(
    values,
    all(isNotNil)
  )

  const isValidAddress = both(
    hasNoNilValues,
    hasAllRequiredFields
  )

  const getAddress = ifElse(
    isValidAddress,
    identity,
    always(defaultAddress)
  )

  boleto.payer_address = getAddress(boleto.payer_address)
}

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

    issuer_wallet: {
      type: STRING
    },

    issuer_agency: {
      type: STRING
    },

    issuer_account: {
      type: STRING
    },

    title_id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true
    },

    reference_id: {
      type: STRING
    },

    barcode: {
      type: STRING
    },

    digitable_line: {
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

    payer_address: {
      type: JSON
    },

    company_name: {
      type: STRING,
      allowNull: true
    },

    company_document_number: {
      type: STRING,
      allowNull: true
    },

    bank_response_code: {
      type: STRING
    },

    issuer_response_code: {
      type: STRING
    }
  // tslint:disable-next-line:align
  }, {
    indexes: [
      { fields: ['queue_url'] },
      { fields: ['status'] }
    ],
    hooks: {
      afterCreate: addBoletoCode,
      beforeValidate: validateModel
    }
  })
}

export default {
  create
}
