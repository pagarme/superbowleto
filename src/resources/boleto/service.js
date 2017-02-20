import { mergeAll } from 'ramda'
import { models } from '../../database'
import { NotFoundError } from '../errors'
import { getPaginationQuery } from '../../lib/pagination'

const { Boleto } = models

export const create = data =>
  Boleto.create(data)
    .then(Boleto.buildResponse)

export const index = ({ page, count }) => {
  const paginationQuery = getPaginationQuery({ page, count })
  const query = mergeAll([{}, paginationQuery])

  return Boleto.findAll(query)
    .then(Boleto.buildResponse)
}

export const show = (id) => {
  const query = {
    where: {
      id
    }
  }

  return Boleto.findOne(query)
    .then((boleto) => {
      if (!boleto) {
        throw new NotFoundError({
          message: 'Boleto not found'
        })
      }

      return boleto
    })
    .then(Boleto.buildResponse)
}
