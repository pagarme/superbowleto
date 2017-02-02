import { buildResponse } from '../lib/response'
import * as queue from '../services/queue'

export const create = (event, context, callback) => {
  queue.create({ queue_url: 'test-queue' })
    .then(data => buildResponse(data, 201))
    .then(response => callback(null, response))
}
