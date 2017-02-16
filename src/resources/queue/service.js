import { mergeAll } from 'ramda'
import { models } from '../../database'
import { NotFoundError } from '../errors'
import { getPaginationQuery } from '../../database/lib/pagination'

export const create = data => models.queue.create(data)

export const index = ({ page, count }) => {
  const paginationQuery = getPaginationQuery({ page, count })
  const query = mergeAll([{}, paginationQuery])

  return models.queue.findAll(query)
}

export const show = (id) => {
  const query = {
    where: {
      id
    }
  }

  return models.queue.findOne(query)
    .then((queue) => {
      if (!queue) {
        throw new NotFoundError()
      }

      return queue
    })
}
