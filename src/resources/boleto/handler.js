import Promise from 'bluebird'
import { buildSuccessResponse, buildFailureResponse } from '../../lib/http/response'
import { ValidationError, NotFoundError } from '../../lib/errors'
import * as boleto from './service'

export const create = (event, context, callback) => {
  const body = JSON.parse(event.body || JSON.stringify({}))

  Promise.resolve(body)
    .then(boleto.create)
    .then(buildSuccessResponse(201))
    .catch(ValidationError, buildFailureResponse(400))
    .catch(buildFailureResponse(500))
    .then(response => callback(null, response))
}

export const index = (event, context, callback) => {
  const { queryStringParameters = {} } = event
  const { page, count } = queryStringParameters

  Promise.resolve({ page, count })
    .then(boleto.index)
    .then(buildSuccessResponse(200))
    .catch(buildFailureResponse(500))
    .then(response => callback(null, response))
}

export const show = (event, context, callback) => {
  const { pathParameters = {} } = event
  const { id } = pathParameters

  Promise.resolve(id)
    .then(boleto.show)
    .then(buildSuccessResponse(200))
    .catch(NotFoundError, buildFailureResponse(404))
    .catch(buildFailureResponse(500))
    .then(response => callback(null, response))
}
