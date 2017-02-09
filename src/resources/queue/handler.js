import Promise from 'bluebird'
import { buildResponse } from '../../lib/response'
import { NotFoundError } from '../errors'
import * as queue from './service'

export const create = (event, context, callback) => {
  const body = JSON.parse(event.body || JSON.stringify({}))

  Promise.resolve(body)
    .then(queue.create)
    .then(data => buildResponse(201, data))
    .then(response => callback(null, response))
    .catch(err => callback(err))
}

export const show = (event, context, callback) => {
  const { pathParameters } = event
  const { id } = pathParameters

  Promise.resolve(id)
    .then(queue.show)
    .then(data => buildResponse(200, data))
    .then(response => callback(null, response))
    .catch(NotFoundError, () => callback(null, buildResponse(404)))
    .catch(err => callback(err))
}
