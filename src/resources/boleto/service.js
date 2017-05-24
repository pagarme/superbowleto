import Promise from 'bluebird'
import { mergeAll } from 'ramda'
import { models } from '../../database'
import { NotFoundError } from '../../lib/errors'
import { handleDatabaseErrors } from '../../lib/errors/database'
import { getPaginationQuery } from '../../lib/database/pagination'
import sqs from '../../lib/sqs'
import { BoletosToRegisterQueue } from './queues'

const { Boleto } = models

export const create = data =>
  Promise.resolve(data)
    .then(Boleto.create.bind(Boleto))
    .then(Boleto.buildResponse)
    .catch(handleDatabaseErrors)

export const register = data =>
  Promise.resolve(data)

export const registerById = id =>
  Boleto.findOne({
    where: {
      id
    }
  })
    .then(register)

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

export const processBoletosToRegister = () => {
  const processBoleto = (item, message) => {
    const QueueUrl = BoletosToRegisterQueue.options.endpoint
    const ReceiptHandle = message.ReceiptHandle

    return sqs.deleteMessage({ QueueUrl, ReceiptHandle }).promise()
  }

  BoletosToRegisterQueue.startProcessing(processBoleto, {
    keepMessages: true
  })
}
