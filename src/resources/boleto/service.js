import { mergeAll } from 'ramda'
import { models } from '../../database'
import { NotFoundError } from '../errors'
import { getPaginationQuery } from '../../database/lib/pagination'

export const create = data => models.boleto.create(data)

export const index = ({ page, count }) => {
  const paginationQuery = getPaginationQuery({ page, count })
  const query = mergeAll([{}, paginationQuery])

  return models.boleto.findAll(query)
}

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
