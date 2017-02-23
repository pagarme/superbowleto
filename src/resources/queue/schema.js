import Joi from 'joi'

export const schema = {
  name: Joi
    .string(),

  url: Joi
    .string()
    .required()
}
