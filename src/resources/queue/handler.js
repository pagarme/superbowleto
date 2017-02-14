import Promise from 'bluebird'
import { buildResponse } from '../../lib/response'
import { NotFoundError } from '../errors'
import * as queue from './service'

export const create = (event, context, callback) => {
  const body = JSON.parse(event.body || JSON.stringify({}))

  Promise.resolve(body)
    .then(queue.create)
    .then(data => callback(null, buildResponse(201, data)))
    .catch(err => callback(err))
}

export const index = (event, context, callback) => {
  const { queryStringParameters = {} } = event
  const { page, count } = queryStringParameters

  Promise.resolve({ page, count })
    .then(queue.index)
    .then(data => callback(null, buildResponse(200, data)))
    .catch(err => callback(err))
}

export const show = (event, context, callback) => {
  const { pathParameters = {} } = event
  const { id } = pathParameters

  Promise.resolve(id)
    .then(queue.show)
    .then(data => callback(null, buildResponse(200, data)))
    .catch(NotFoundError, () => callback(null, buildResponse(404)))
    .catch(err => callback(err))
}
