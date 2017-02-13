import { prop } from 'ramda'
import { models } from '../../../../src/database'

export const queueMock = {
  name: 'test',
  url: 'http://yopa/queue/test'
}

export const createQueue = (data = queueMock) =>
  models.queue.create(data)
    .then(prop('dataValues'))
