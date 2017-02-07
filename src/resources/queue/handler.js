import { buildResponse } from '../../lib/response'
import * as queue from './service'

export const create = (event, context, callback) => {
  const body = JSON.parse(event.body || JSON.stringify({}))

  queue.create(body)
    .then(data => buildResponse(201, data))
    .then(response => callback(null, response))
    .catch(err => callback(err))
}
