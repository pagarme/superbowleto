import Joi from 'joi'

export const schema = {
  queue_id: Joi
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

  payer_name: Joi
    .string()
    .required(),

  payer_document_type: Joi
    .equal(['cpf', 'cnpj']),

  payer_document_number: Joi
    .number()
    .integer()
    .required()
}
