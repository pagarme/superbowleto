import { models } from '../../../../src/database'

const { Queue } = models

export const queueMock = {
  name: 'test',
  url: 'http://yopa/queue/test'
}

export const createQueue = (data = queueMock) =>
  Queue.create(data)
    .then(Queue.buildResponse)
