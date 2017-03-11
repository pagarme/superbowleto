import Promise from 'bluebird'
import { mergeAll, tap } from 'ramda'
import { models } from '../../database'
import { NotFoundError } from '../../lib/errors'
import { handleDatabaseErrors } from '../../lib/errors/database'
import { getPaginationQuery } from '../../lib/pagination'
import { parse } from '../../lib/http/request'
import { schema } from './schema'
import { BoletosToRegisterQueue } from './queues'

const { Boleto } = models

export const create = (data) => {
  const sendBoletoToQueue = tap(boleto => BoletosToRegisterQueue.sendMessage({
    boleto_id: boleto.id,
    issuer: boleto.issuer
  }))

  return Promise.resolve(data)
    .then(parse(schema))
    .then(Boleto.create.bind(Boleto))
    .then(Boleto.buildResponse)
    .then(sendBoletoToQueue)
    .catch(handleDatabaseErrors)
}

export const index = ({ page, count }) => {
  const paginationQuery = getPaginationQuery({ page, count })
  const query = mergeAll([{}, paginationQuery])

  return Boleto.findAll(query)
    .then(Boleto.buildResponse)
    .catch(handleDatabaseErrors)
}

export const show = (id) => {
  const query = {
    where: {
      id
    }
  }

  return Boleto.findOne(query)
    .then((boleto) => {
      if (!boleto) {
        throw new NotFoundError({
          message: 'Boleto not found'
        })
      }

      return boleto
    })
    .then(Boleto.buildResponse)
    .catch(handleDatabaseErrors)
}
