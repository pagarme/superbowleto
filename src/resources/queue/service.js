import { mergeAll } from 'ramda'
import { models } from '../../database'
import { NotFoundError } from '../errors'
import { getPaginationQuery } from '../../lib/pagination'

const { Queue } = models

export const create = data =>
  Queue.create(data)
    .then(Queue.buildResponse)

export const index = ({ page, count }) => {
  const paginationQuery = getPaginationQuery({ page, count })
  const query = mergeAll([{}, paginationQuery])

  return Queue.findAll(query)
    .then(Queue.buildResponse)
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
        throw new NotFoundError()
      }

      return queue
    })
    .then(Queue.buildResponse)
}
