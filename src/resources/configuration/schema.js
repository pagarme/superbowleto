const Joi = require('joi')

const createSchema = {
  external_id: Joi
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

  issuer: Joi
    .string()
    .valid('bradesco', 'boleto-api-bradesco-shopfacil', 'boleto-api-caixa', 'development')
    .required(),
}

const updateSchema = {
  id: Joi
    .string()
    .required(),

  issuer_account: Joi
    .string(),

  issuer_agency: Joi
    .string(),

  issuer_wallet: Joi
    .string(),

  issuer: Joi
    .string()
    .valid('bradesco', 'boleto-api-bradesco-shopfacil', 'boleto-api-caixa', 'development'),
}

module.exports = {
  createSchema,
  updateSchema,
}
