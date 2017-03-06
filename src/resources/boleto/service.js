import { mergeAll } from 'ramda'
import { models } from '../../database'
import { NotFoundError } from '../errors'
import { handleDatabaseErrors } from '../errors/database'
import { getPaginationQuery } from '../../lib/pagination'
import { parse } from '../../lib/request'
import { schema } from './schema'

const { Boleto } = models

export const create = data => Promise.resolve(data)
  .then(parse(schema))
  .then(Boleto.create.bind(Boleto))
  .then(Boleto.buildResponse)
  .catch(handleDatabaseErrors)

export const index = ({ page, count }) => {
  const paginationQuery = getPaginationQuery({ page, count })
  const query = mergeAll([{}, paginationQuery])

  return Boleto.findAll(query)
    .then(Boleto.buildResponse)
    .catch(handleDatabaseErrors)
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
    .catch(handleDatabaseErrors)
}
