import { buildResponse } from '../lib/response'
import * as boleto from '../services/boleto'

export const create = (event, context, callback) => {
  boleto.create({ barcode: 3000123 })
    .then(data => buildResponse(201, data))
    .then(response => callback(null, response))
}

export const show = (evenet, context, callback) => {
  boleto.show()
    .then(data => buildResponse(200, data))
    .then(response => callback(null, response))
}
