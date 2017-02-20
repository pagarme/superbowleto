import Promise from 'bluebird'
import { buildSuccessResponse, buildFailureResponse } from '../../lib/response'
import { NotFoundError } from '../errors'
import * as queue from './service'

export const create = (event, context, callback) => {
  const body = JSON.parse(event.body || JSON.stringify({}))

  Promise.resolve(body)
    .then(queue.create)
    .then(buildSuccessResponse(201))
    .catch(buildFailureResponse(500))
    .then(response => callback(null, response))
}

export const index = (event, context, callback) => {
  const { queryStringParameters = {} } = event
  const { page, count } = queryStringParameters

  Promise.resolve({ page, count })
    .then(queue.index)
    .then(buildSuccessResponse(200))
    .catch(buildFailureResponse(500))
    .then(response => callback(null, response))
}

export const show = (event, context, callback) => {
  const { pathParameters = {} } = event
  const { id } = pathParameters

  Promise.resolve(id)
    .then(queue.show)
    .then(buildSuccessResponse(200))
    .catch(NotFoundError, buildFailureResponse(404))
    .catch(buildFailureResponse(500))
    .then(response => callback(null, response))
}
