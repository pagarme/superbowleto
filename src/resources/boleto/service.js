import Promise from 'bluebird'
import { mergeAll } from 'ramda'
import { models } from '../../database'
import { NotFoundError } from '../../lib/errors'
import { handleDatabaseErrors } from '../../lib/errors/database'
import { getPaginationQuery } from '../../lib/database/pagination'
import sqs from '../../lib/sqs'
import { BoletosToRegisterQueue } from './queues'
import { findProvider } from '../../providers'
import { makeFromLogger } from '../../lib/logger'
import { defaultCuidValue } from '../../lib/database/schema'

const makeLogger = makeFromLogger('boleto/service')

const { Boleto } = models

export const create = (data) => {
  const logger = makeLogger({ operation: 'create' }, { id: defaultCuidValue('req_')() })

  logger.info({ status: 'started', metadata: { data } })

  return Promise.resolve(data)
    .then(Boleto.create.bind(Boleto))
    .tap((boleto) => {
      logger.info({ status: 'succeeded', metadata: { boleto } })
    })
    .catch((err) => {
      logger.error({ status: 'failed', metadata: { err } })
      return handleDatabaseErrors(err)
    })
}

export const register = (boleto) => {
  const provider = findProvider(boleto.issuer)

  const logger = makeLogger({ operation: 'register' }, { id: defaultCuidValue('req_')() })

  const updateBoletoStatus = (obj) => {
    const status = obj.status

    let newBoletoStatus

    if (status === 'registered') {
      newBoletoStatus = 'registered'
    } else if (status === 'refused') {
      newBoletoStatus = 'refused'
    } else {
      newBoletoStatus = 'pending_registration'
    }

    return boleto.update({
      status: newBoletoStatus
    })
  }

  if (boleto.status === 'refused' || boleto.status === 'registered') {
    return Promise.resolve(boleto)
  }

  return provider.register(boleto)
    .then(updateBoletoStatus)
    // eslint-disable-next-line
    .tap((boleto) => {
      logger.info({ status: 'succeeded', metadata: { boleto } })
    })
    .catch((err) => {
      logger.error({ status: 'failed', metadata: { err } })
      throw err
    })
}

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
