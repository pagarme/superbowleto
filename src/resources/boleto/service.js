import { models } from '../../database'
import { NotFoundError } from '../errors'

export const create = data => models.boleto.create(data)

export const show = (id) => {
  const query = {
    where: {
      id
    }
  }

  return models.boleto.findOne(query)
    .then((boleto) => {
      if (!boleto) {
        throw new NotFoundError()
      }

      return boleto
    })
}
