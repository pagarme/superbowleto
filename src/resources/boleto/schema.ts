import * as Joi from 'joi'

export const createSchema = {
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

  register: Joi
    .boolean()
    .default(true)
}

export const updateSchema = {
  id: Joi
    .string()
    .required(),

  paid_amount: Joi
    .number()
    .integer(),

  bank_response_code: Joi
    .string()
}

export const indexSchema = {
  token: Joi
    .string(),

  title_id: Joi
    .string(),

  page: Joi
    .number()
    .integer(),

  count: Joi
    .number()
    .integer()
}
