import Promise from 'bluebird'
import { buildSuccessResponse, buildFailureResponse } from '../../lib/http/response'
import { ValidationError, NotFoundError } from '../../lib/errors'
import * as boletoService from './service'
import { parse } from '../../lib/http/request'
import { schema as requestSchema } from './schema'

const handleError = (err) => {
  if (err instanceof ValidationError) {
    return buildFailureResponse(400, err)
  }

  if (err instanceof NotFoundError) {
    return buildFailureResponse(404, err)
  }

  return buildFailureResponse(500, err)
}

export const create = (event, context, callback) => {
  const body = JSON.parse(event.body || JSON.stringify({}))

  Promise.resolve(body)
    .then(parse(requestSchema))
    .then(boletoService.create)
    .then((boleto) => {
      const shouldRegister = body.register

      if (shouldRegister) {
        return boletoService.register(boleto)
      }

      return boleto
    })
    .then(buildSuccessResponse(201))
    .catch(handleError)
    .then(response => callback(null, response))
}

export const index = (event, context, callback) => {
  const { queryStringParameters = {} } = event
  const { page, count } = queryStringParameters

  Promise.resolve({ page, count })
    .then(boletoService.index)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .then(response => callback(null, response))
}

export const show = (event, context, callback) => {
  const { pathParameters = {} } = event
  const { id } = pathParameters

  Promise.resolve(id)
    .then(boletoService.show)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .then(response => callback(null, response))
}

export const processBoletosToRegister = (event, context, callback) => {
  Promise.resolve(boletoService.processBoletosToRegister)
    .then(() => callback(null))
    .catch(err => callback(err))
}
