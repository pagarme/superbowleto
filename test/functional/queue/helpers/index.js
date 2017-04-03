import { models } from '../../../../src/database'

const { Queue } = models

export const mock = {
  name: 'test',
  url: 'http://yopa/queue/test'
}

export const createQueue = (data = {}) =>
  Queue.create(Object.assign({}, mock, data))
    .then(Queue.buildResponse)
