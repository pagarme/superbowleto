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
    .integer(),

  token: Joi
    .string(),

  instructions: Joi
    .string(),

  issuer: Joi
    .string()
    .required(),

  reference_id: Joi
    .string(),

  company_name: Joi
    .string()
    .required(),

  company_document_number: Joi
    .string()
    .required(),

  payer_name: Joi
    .string()
    .when('register', { is: true, then: Joi.required() }),

  payer_document_type: Joi
    .equal(['cpf', 'cnpj'])
    .when('register', { is: true, then: Joi.required() }),

  payer_document_number: Joi
    .number()
    .integer()
    .when('register', { is: true, then: Joi.required() }),

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
