import { models } from '../../database'
import { NotFoundError } from '../errors'

export const create = data => models.queue.create(data)

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
