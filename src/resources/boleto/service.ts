import * as Promise from 'bluebird'
import { mergeAll } from 'ramda'
import { getModel } from '../../database'
import { NotFoundError } from '../../lib/errors'
import { handleDatabaseErrors } from '../../lib/errors/database'
import { getPaginationQuery } from '../../lib/database/pagination'
import sqs from '../../lib/sqs'
import { BoletosToRegisterQueue, BoletosToRegisterQueueUrl } from './queues'
import { findProvider } from '../../providers'
import { makeFromLogger } from '../../lib/logger'
import { defaultCuidValue } from '../../lib/database/schema'

const makeLogger = makeFromLogger('boleto/service')

export const create = (data) => {
  const logger = makeLogger({ operation: 'create' }, { id: defaultCuidValue('req_')() })

  logger.info({ status: 'started', metadata: { data } })

  return getModel('Boleto')
    .then(Boleto =>
      Promise.resolve(data)
      .then(Boleto.create.bind(Boleto))
      .tap((boleto) => {
        logger.info({ status: 'succeeded', metadata: { boleto } })
      })
      .catch((err) => {
        logger.error({ status: 'failed', metadata: { err } })
        return handleDatabaseErrors(err)
      })
    )
}

export const register = (boleto) => {
  const provider = findProvider(boleto.issuer)
  const timeoutMs = process.env.NODE_ENV === 'production' ? 6000 : 25000

  const logger = makeLogger({ operation: 'register' }, { id: defaultCuidValue('req_')() })

  const updateBoletoStatus = (response) => {
    const status = response.status

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

  return Promise.resolve(boleto)
    .then(provider.register)
    .timeout(timeoutMs)
    .then(updateBoletoStatus)
    .catch(() => {
      logger.info({
        status: 'processing',
        message: 'Boleto register failed: will send to background registering',
        metadata: {
          boleto
        }
      })

      boleto.update({
        status: 'pending_registration'
      })
    })
    .tap((boleto) => {
      logger.info({ status: 'succeeded', metadata: { boleto } })
    })
    .catch((err) => {
      logger.error({ status: 'failed', metadata: { err } })
      throw err
    })
}

export const registerById = id =>
  getModel('Boleto')
    .then(Boleto => Boleto.findOne({
      where: {
        id
      }
    }))
    .then(register)

export const update = (data) => {
  const logger = makeLogger({ operation: 'update' }, { id: defaultCuidValue('req_')() })
  logger.info({ status: 'started', metadata: { data } })

  const id = data.id
  const bankResponseCode = data.bank_response_code
  const paidAmount = data.paid_amount

  const query = {
    where: {
      id
    }
  }

  return getModel('Boleto')
    .then(Boleto => Boleto.findOne(query)
      .then((boleto) => {
        if (!boleto) {
          throw new NotFoundError({
            message: 'Boleto not found'
          })
        }

        return boleto.update({
          paid_amount: paidAmount || boleto.paid_amount,
          bank_response_code: bankResponseCode || boleto.bank_response_code
        })
      })
      .tap((boleto) => {
        logger.info({ status: 'succeeded', metadata: { boleto } })
      })
      .catch(handleDatabaseErrors))
}

export const index = ({ page, count, token, title_id }) => {
  const whereQuery = {
    where: {
    }
  }

  const orderQuery = {
    order: 'id DESC'
  }

  const possibleFields = { token, title_id }

  for (const field in possibleFields) {
    if (possibleFields[field]) {
      whereQuery.where[field] = possibleFields[field]
    }
  }

  const paginationQuery = getPaginationQuery({ page, count })

  const query = mergeAll([
    {},
    paginationQuery,
    whereQuery,
    orderQuery
  ])

  return getModel('Boleto')
    .then(Boleto => Boleto.findAll(query)
      .catch(handleDatabaseErrors))
}

export const show = (id) => {
  const query = {
    where: {
      id
    }
  }

  return getModel('Boleto')
    .then(Boleto => Boleto.findOne(query)
      .then((boleto) => {
        if (!boleto) {
          throw new NotFoundError({
            message: 'Boleto not found'
          })
        }

        return boleto
      })
      .catch(handleDatabaseErrors))
}

export const processBoleto = (item, sqsMessage) => {
  const { boleto_id } = item

  const logger = makeLogger({ operation: 'process_boleto' }, { id: defaultCuidValue('req_')() })

  // eslint-disable-next-line
  const removeBoletoFromQueueConditionally = (boleto) => {
    if (boleto.status === 'registered' || boleto.status === 'refused') {
      logger.info({
        subOperation: 'removeFromQueue', status: 'started',
        metadata: { boleto_id: boleto.id }
      })
      return BoletosToRegisterQueue.remove(sqsMessage)
        .then(() => {
          logger.info({
            subOperation: 'removeFromQueue', status: 'succeeded',
            metadata: { boleto_id: boleto.id }
          })
        })
        .catch((err) => {
          logger.info({
            subOperation: 'removeFromQueue', status: 'failed',
            metadata: { err, boleto_id: boleto.id }
          })
          throw err
        })
    }
  }

  const sendMessageToUserQueueConditionally = (boleto) => {
    if (boleto.status === 'registered' || boleto.status === 'refused') {
      logger.info({
        subOperation: 'sendToUserQueue', status: 'started',
        metadata: { boleto_id: boleto.id }
      })

      const params = {
        MessageBody: JSON.stringify({
          boleto_id: boleto.id,
          status: boleto.status,
          reference_id: boleto.reference_id
        }),
        QueueUrl: boleto.queue_url
      }

      return sqs.sendMessage(params).promise()
        .then(() => {
          logger.info({
            subOperation: 'sendToUserQueue', status: 'succeeded',
            metadata: { boleto_id: boleto.id }
          })
        })
        .catch((err) => {
          logger.info({
            subOperation: 'sendToUserQueue', status: 'failed',
            metadata: { err, boleto_id: boleto.id }
          })
          throw err
        })
    }
  }

  logger.info({ status: 'started', metadata: item })

  return Promise.resolve(boleto_id)
    .then(registerById)
    .tap(removeBoletoFromQueueConditionally)
    .tap(sendMessageToUserQueueConditionally)
    .tap((response) => {
      logger.info({
        status: 'succeeded',
        metadata: { body: response.body, statusCode: response.statusCode }
      })
    })
    .catch((err) => {
      logger.error({ status: 'failed', metadata: { err } })
    })
}
