const Joi = require('joi')

const createSchema = {
  queue_url: Joi
    .string()
    .required(),

  expiration_date: Joi
    .date()
    .required(),

  amount: Joi
    .number()
    .integer()
    .required(),

  discount: Joi.array().items(Joi.object().keys({
    percentage: Joi
      .number()
      .integer()
      .min(0)
      .max(100),

    amount: Joi
      .number()
      .integer(),

    limit_date: Joi
      .string(),
  })),

  interest: Joi.object().keys({
    percentage: Joi
      .number()
      .integer()
      .min(0)
      .max(100),

    amount: Joi
      .number()
      .integer(),

    days: Joi
      .number()
      .integer(),
  }),

  fine: Joi.object().keys({
    percentage: Joi
      .number()
      .integer()
      .min(0)
      .max(100),

    amount: Joi
      .number()
      .integer(),

    days: Joi
      .number()
      .integer(),
  }),

  title_id: Joi
    .number()
    .integer()
    .allow(null),

  token: Joi
    .string()
    .allow(null),

  instructions: Joi
    .string()
    .allow('')
    .allow(null),

  issuer: Joi
    .string()
    .required(),

  issuer_account: Joi
    .string()
    .required(),

  issuer_agency: Joi
    .string()
    .required(),

  issuer_wallet: Joi
    .string()
    .required(),

  reference_id: Joi
    .string()
    .allow(null),

  company_name: Joi
    .string()
    .allow(null)
    .allow(''),

  company_document_number: Joi
    .string()
    .allow(null)
    .allow(''),

  company_address: Joi.object().keys({
    zipcode: Joi
      .string()
      .allow(null)
      .allow(''),

    street: Joi
      .string()
      .allow(null)
      .allow(''),

    complementary: Joi
      .string()
      .allow(null)
      .allow(''),

    neighborhood: Joi
      .string()
      .allow(null)
      .allow(''),

    street_number: Joi
      .alternatives()
      .try(Joi.string(), Joi.number())
      .allow(null)
      .allow(''),

    city: Joi
      .string()
      .allow(null)
      .allow(''),

    state: Joi
      .string()
      .allow(null)
      .allow(''),
  }),

  payer_name: Joi
    .string()
    .allow(null)
    .allow('')
    .when('register', { is: true, then: Joi.required().disallow(null).disallow('') }),

  payer_document_type: Joi
    .equal(['cpf', 'cnpj'])
    .allow(null)
    .allow('')
    .when('register', { is: true, then: Joi.required().disallow(null).disallow('') }),

  payer_document_number: Joi
    .string()
    .allow(null)
    .allow('')
    .when('register', { is: true, then: Joi.required().disallow(null).disallow('') }),

  payer_address: Joi.object().keys({
    zipcode: Joi
      .string()
      .allow(null)
      .allow(''),

    street: Joi
      .string()
      .allow(null)
      .allow(''),

    complementary: Joi
      .string()
      .allow(null)
      .allow(''),

    neighborhood: Joi
      .string()
      .allow(null)
      .allow(''),

    street_number: Joi
      .alternatives()
      .try(Joi.string(), Joi.number())
      .allow(null)
      .allow(''),

    city: Joi
      .string()
      .allow(null)
      .allow(''),

    state: Joi
      .string()
      .allow(null)
      .allow(''),
  }),

  register: Joi
    .boolean()
    .default(true),
}

const updateSchema = {
  id: Joi
    .string()
    .required(),

  paid_amount: Joi
    .number()
    .integer(),

  bank_response_code: Joi
    .string(),
}

const indexSchema = {
  token: Joi
    .string(),

  title_id: Joi
    .string(),

  page: Joi
    .number()
    .integer(),

  count: Joi
    .number()
    .integer(),
}

module.exports = {
  createSchema,
  updateSchema,
  indexSchema,
}
