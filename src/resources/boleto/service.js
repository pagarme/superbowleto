import Promise from 'bluebird'
import { mergeAll, tap } from 'ramda'
import { models } from '../../database'
import { NotFoundError } from '../../lib/errors'
import { handleDatabaseErrors } from '../../lib/errors/database'
import { getPaginationQuery } from '../../lib/database/pagination'
import { parse } from '../../lib/http/request'
import sqs from '../../lib/sqs'
import { schema } from './schema'
import { BoletosToRegisterQueue } from './queues'

const { Boleto } = models

export const create = (data) => {
  const sendBoletoToQueue = tap(boleto => BoletosToRegisterQueue.push({
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
