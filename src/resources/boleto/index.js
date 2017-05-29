import Promise from 'bluebird'
import { buildSuccessResponse, buildFailureResponse } from '../../lib/http/response'
import { ValidationError, NotFoundError } from '../../lib/errors'
import * as boletoService from './service'
import { parse } from '../../lib/http/request'
import { schema as requestSchema } from './schema'
import { makeFromLogger } from '../../lib/logger'
import { defaultCuidValue } from '../../lib/database/schema'

const makeLogger = makeFromLogger('boleto/index')

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

  const logger = makeLogger({}, { id: defaultCuidValue('req_')() })

  logger.info({ operation: 'create', status: 'started', metadata: { body } })

  Promise.resolve(body)
    .then(parse(requestSchema))
    .then(boletoService.create)
    .then((boleto) => {
      const shouldRegister = body.register

      if (shouldRegister) {
        logger.info({ operation: 'register', status: 'started' })

        return boletoService.register(boleto)
          .tap(() => {
            logger.info({ operation: 'register', status: 'succeeded' })
          })
          .catch((err) => {
            logger.error({ operation: 'register', status: 'failed', metadata: { err } })
          })
      }

      return boleto
    })
    .then(buildSuccessResponse(201))
    .tap((response) => {
      logger.info({
        operation: 'create',
        status: 'succeeded',
        metadata: { body: response.body, statusCode: response.statusCode }
      })
    })
    .catch((err) => {
      logger.error({ operation: 'create', status: 'failed', metadata: { err } })
      return handleError(err)
    })
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
