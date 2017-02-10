import Promise from 'bluebird'
import { buildResponse } from '../../lib/response'
import * as boleto from './service'

export const create = (event, context, callback) => {
  const body = JSON.parse(event.body || JSON.stringify({}))

  Promise.resolve(body)
    .then(boleto.create)
    .then(data => buildResponse(201, data))
    .then(response => callback(null, response))
    .catch(err => callback(err))
}

export const show = (event, context, callback) => {
  boleto.show()
    .then(data => buildResponse(200, data))
    .then(response => callback(null, response))
}
