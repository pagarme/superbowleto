const Promise = require('bluebird')
const {
  T,
  all,
  always,
  assoc,
  both,
  complement,
  cond,
  equals,
  identity,
  ifElse,
  intersection,
  isNil,
  keys,
  pipe,
  pick,
  values,
  pickAll,
} = require('ramda')

const {
  STRING, INTEGER, ENUM, TEXT, DATE, JSON, ARRAY,
} = require('sequelize')
const { Boleto: NodeBoleto } = require('node-boleto')
const { defaultCuidValue, responseObjectBuilder } = require('../../lib/database/schema')

const { getPagarmeAddress } = require('../../providers/boleto-api-caixa/formatter')

const barcodeBank = cond([
  [equals('development'), always('bradesco')],
  [equals('boleto-api-bradesco-shopfacil'), always('bradesco')],
  [equals('boleto-api-caixa'), always('bradesco')],
  [T, identity],
])

const generateBoletoCode = (boleto) => {
  const nodeBoleto = new NodeBoleto({
    banco: barcodeBank(boleto.issuer),
    valor: boleto.amount,
    nosso_numero: boleto.title_id,
    data_vencimento: boleto.expiration_date,
    agencia: boleto.issuer_agency,
    codigo_cedente: boleto.issuer_account,
    carteira: boleto.issuer_wallet,
  })

  return {
    barcode: nodeBoleto.barcode_data,
    digitable_line: nodeBoleto.linha_digitavel,
  }
}

const buildModelResponse = responseObjectBuilder(boleto =>
  Promise.resolve(boleto)
    .then(pick([
      'id',
      'token',
      'queue_url',
      'status',
      'expiration_date',
      'amount',
      'paid_amount',
      'interest',
      'fine',
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
      'external_id',
      'company_name',
      'company_document_number',
      'company_address',
      'bank_response_code',
      'rules',
      'boleto_url',
      'reference_id',
      'created_at',
      'updated_at',
    ]))
    .then(assoc('object', 'boleto')))

const addBoletoCode = (boleto) => {
  const { barcode, digitable_line } = generateBoletoCode(boleto) // eslint-disable-line

  boleto.updateAttributes({
    barcode,
    digitable_line,
  })
}

const validateModel = (boleto) => {
  const defaultAddress = getPagarmeAddress()

  const requiredAddressFields = [
    'zipcode',
    'street',
    'street_number',
    'neighborhood',
    'city',
    'state',
  ]

  const hasAllRequiredFields = pipe(
    keys,
    intersection(requiredAddressFields),
    equals(requiredAddressFields)
  )

  const isNotNil = complement(isNil)

  const hasNoNilValues = pipe(
    pickAll(requiredAddressFields),
    values,
    all(isNotNil)
  )

  const isValidAddress = both(
    hasAllRequiredFields,
    hasNoNilValues
  )

  const getAddress = ifElse(
    isValidAddress,
    identity,
    always(defaultAddress)
  )

  boleto.payer_address = getAddress(boleto.payer_address) // eslint-disable-line
  boleto.company_address = getAddress(boleto.company_address) // eslint-disable-line
}

function create (database) {
  return database.define('Boleto', {
    id: {
      type: STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: defaultCuidValue('bol_'),
    },

    token: {
      type: STRING,
      allowNull: false,
      defaultValue: defaultCuidValue(`${process.env.STAGE}_`),
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

    interest: {
      type: JSON,
      defaultValue: {},
    },

    fine: {
      type: JSON,
      defaultValue: {},
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

    issuer_wallet: {
      type: STRING,
    },

    issuer_agency: {
      type: STRING,
    },

    issuer_account: {
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

    digitable_line: {
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

    payer_address: {
      type: JSON,
    },

    external_id: {
      type: STRING,
      allowNull: true,
    },

    company_name: {
      type: STRING,
      allowNull: true,
    },

    company_document_number: {
      type: STRING,
      allowNull: true,
    },

    company_address: {
      type: JSON,
    },

    bank_response_code: {
      type: STRING,
    },

    issuer_response_code: {
      type: STRING,
    },

    rules: {
      type: ARRAY(TEXT),
      allowNull: true,
    },

    boleto_url: {
      type: STRING,
      allowNull: true,
    },
  }, {
    indexes: [
      { fields: ['queue_url'] },
      { fields: ['status'] },
      { fields: ['token'] },
      { fields: ['title_id'] },
    ],
    hooks: {
      afterCreate: addBoletoCode,
      beforeValidate: validateModel,
    },
  })
}

module.exports = {
  generateBoletoCode,
  buildModelResponse,
  validateModel,
  create,
}
