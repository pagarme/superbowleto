import { buildResponse } from '../../lib/response'
import * as queue from './service'

export const create = (event, context, callback) => {
  queue.create({ queue_url: 'test-queue' })
    .then(data => buildResponse(201, data))
    .then(response => callback(null, response))
}
