import * as Promise from 'bluebird'
import { mergeAll } from 'ramda'
import { getModel } from '../../database'
import { getPaginationQuery } from '../../lib/database/pagination'
import { defaultCuidValue } from '../../lib/database/schema'
import { NotFoundError } from '../../lib/errors'
import { handleDatabaseErrors } from '../../lib/errors/database'
import { makeFromLogger } from '../../lib/logger'
import sqs from '../../lib/sqs'
import { findProvider } from '../../providers'
import { BoletosToRegisterQueue, BoletosToRegisterQueueUrl } from './queues'

const makeLogger = makeFromLogger('boleto/service')

export const create = (data) => {
  const logger = makeLogger({ operation: 'create' }, { id: defaultCuidValue('req_')() })

  logger.info({ status: 'started', metadata: { data } })

  return getModel('Boleto')
    .then(boletoModel =>
      Promise.resolve(data)
      .then(boletoModel.create.bind(boletoModel))
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

  return provider.register(boleto)
    .then(updateBoletoStatus)
    // tslint:disable-next-line
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
    .then(boletoModel => boletoModel.findOne({
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
    .then(boletoModel => boletoModel.findOne(query)
      .then((boleto) => {
        if (!boleto) {
          throw new NotFoundError({
            message: 'Boleto not found'
          })
        }

        return boleto.update({
          bank_response_code: bankResponseCode || boleto.bank_response_code,
          paid_amount: paidAmount || boleto.paid_amount
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

  // eslint-disable-next-line no-restricted-syntax
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
    .then(boletoModel => boletoModel.findAll(query)
      .catch(handleDatabaseErrors))
}

export const show = (id) => {
  const query = {
    where: {
      id
    }
  }

  return getModel('Boleto')
    .then(boletoModel => boletoModel.findOne(query)
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
