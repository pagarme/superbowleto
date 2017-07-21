import * as Joi from 'joi'

export const createSchema = {
  amount: Joi
    .number()
    .integer()
    .required(),

  company_document_number: Joi
    .string()
    .required(),

  company_name: Joi
    .string()
    .required(),

  expiration_date: Joi
    .date()
    .required(),

  instructions: Joi
    .string(),

  issuer: Joi
    .string()
    .required(),

  payer_document_number: Joi
    .number()
    .integer()
    .when('register', { is: true, then: Joi.required() }),

  payer_document_type: Joi
    .equal(['cpf', 'cnpj'])
    .when('register', { is: true, then: Joi.required() }),

  payer_name: Joi
    .string()
    .when('register', { is: true, then: Joi.required() }),

  queue_url: Joi
    .string()
    .required(),

  reference_id: Joi
    .string(),

  register: Joi
    .boolean()
    .default(true),

  title_id: Joi
    .number()
    .integer(),

  token: Joi
    .string()
}

export const updateSchema = {
  bank_response_code: Joi
    .string(),

  id: Joi
    .string()
    .required(),

  paid_amount: Joi
    .number()
    .integer()
}

export const indexSchema = {
  count: Joi
    .number()
    .integer(),

  page: Joi
    .number()
    .integer(),

  title_id: Joi
    .string(),

  token: Joi
    .string()
}
