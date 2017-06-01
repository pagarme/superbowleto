import Joi from 'joi'

export const schema = {
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

  instructions: Joi
    .string(),

  issuer: Joi
    .string()
    .required(),

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
