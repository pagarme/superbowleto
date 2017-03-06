import { mergeAll } from 'ramda'
import { models } from '../../database'
import { NotFoundError } from '../errors'
import { handleDatabaseErrors } from '../errors/database'
import { getPaginationQuery } from '../../lib/pagination'
import { parse } from '../../lib/request'
import { schema } from './schema'

const { Queue } = models

export const create = data => Promise.resolve(data)
  .then(parse(schema))
  .then(Queue.create.bind(Queue))
  .then(Queue.buildResponse)
  .catch(handleDatabaseErrors)

export const index = ({ page, count }) => {
  const paginationQuery = getPaginationQuery({ page, count })
  const query = mergeAll([{}, paginationQuery])

  return Queue.findAll(query)
    .then(Queue.buildResponse)
    .catch(handleDatabaseErrors)
}

export const show = (id) => {
  const query = {
    where: {
      id
    }
  }

  return Queue.findOne(query)
    .then((queue) => {
      if (!queue) {
        throw new NotFoundError({
          message: 'Queue not found'
        })
      }

      return queue
    })
    .then(Queue.buildResponse)
    .catch(handleDatabaseErrors)
}
