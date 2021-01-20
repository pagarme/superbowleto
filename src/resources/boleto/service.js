const Promise = require('bluebird')
const {
  complement,
  filter,
  ifElse,
  isNil,
  mergeAll,
} = require('ramda')
const database = require('../../database')
const { NotFoundError } = require('../../lib/errors')
const { handleDatabaseErrors } = require('../../lib/errors/database')
const { getPaginationQuery } = require('../../lib/database/pagination')
const sqs = require('../../lib/sqs')
const { BoletosToRegisterQueue } = require('./queues')
const { findProvider } = require('../../providers')
const { isBradescoOff } = require('../../providers/bradesco/temp')
const { makeFromLogger } = require('../../lib/logger')
const { changeIssuerWhenInterestOrFine } = require('../../lib/helpers/providers')
const { setBoletoRulesConfiguration } = require('../../lib/helpers/configurations')

const { Boleto } = database.models

const makeLogger = makeFromLogger('boleto/service')

module.exports = function boletoService ({ operationId }) {
  const create = (data) => {
    const logger = makeLogger({ operation: 'handle_boleto_request' }, { id: operationId })

    logger.info({ status: 'started', metadata: { data } })

    return Promise.resolve(data)
      .then(boletoContent => setBoletoRulesConfiguration(
        boletoContent,
        operationId
      ))
      .then(boletoContent => changeIssuerWhenInterestOrFine(
        boletoContent,
        operationId
      ))
      .then(Boleto.create.bind(Boleto))
      .tap((boleto) => {
        logger.info({ status: 'success', metadata: { boleto } })
      })
      .catch((err) => {
        logger.error({
          status: 'failed',
          metadata: {
            error_name: err.name,
            error_stack: err.stack,
            error_message: err.message,
          },
        })
        return handleDatabaseErrors(err)
      })
  }

  const register = (boleto) => {
    const Provider = findProvider(boleto.issuer)
    const provider = Provider.getProvider({ operationId })

    const logger = makeLogger({ operation: 'register' }, { id: operationId })

    const fakeRegister = () =>
      Promise.resolve({
        issuer_response_code: 'fake_issuer_response_code',
        status: 'pending_registration',
      })
        .tap(() => logger.info({
          message: 'fake_register',
          metadata: { boleto },
        }))

    const updateBoletoProviderResponse = ({
      issuer_response_code: issuerResponseCode,
      status,
      boleto_url: boletoUrl,
      digitable_line: digitableLine,
      barcode,
    }) => {
      let newBoletoStatus

      if (status === 'registered') {
        newBoletoStatus = 'registered'
      } else if (status === 'refused') {
        newBoletoStatus = 'refused'
      } else {
        newBoletoStatus = 'pending_registration'
      }

      const isNotNull = complement(isNil)

      const providerResponse = {
        issuer_response_code: issuerResponseCode,
        status: newBoletoStatus,
        boleto_url: boletoUrl,
        digitable_line: digitableLine,
        barcode,
      }

      const providerResponseFiltered = filter(isNotNull, providerResponse)

      return boleto.update(providerResponseFiltered)
    }

    if (boleto.status === 'refused' || boleto.status === 'registered') {
      return Promise.resolve(boleto)
    }

    return Promise.resolve(boleto)
      .then(ifElse(
        isBradescoOff,
        fakeRegister,
        provider.register
      ))
      .then(updateBoletoProviderResponse)
      .catch((err) => {
        logger.info({
          status: 'processing',
          message: 'Boleto register failed: will send to background registering',
          metadata: {
            boleto,
            error_name: err.name,
            error_stack: err.stack,
            error_message: err.message,
          },
        })

        boleto.update({
          status: 'pending_registration',
        })
      })
      .tap((boleto) => { // eslint-disable-line
        logger.info({ status: 'success', metadata: { boleto } })
      })
      .catch((err) => {
        logger.error({
          status: 'failed',
          metadata: {
            error_name: err.name,
            error_stack: err.stack,
            error_message: err.message,
          },
        })
        throw err
      })
  }

  const registerById = id =>
    Boleto.findOne({
      where: {
        id,
      },
    })
      .then(register)

  const update = (data) => {
    const logger = makeLogger({ operation: 'update' }, { id: operationId })
    logger.info({ status: 'started', metadata: { data } })

    const { id } = data
    const bankResponseCode = data.bank_response_code
    const paidAmount = data.paid_amount

    const query = {
      where: {
        id,
      },
    }

    return Boleto.findOne(query)
      .then((boleto) => {
        if (!boleto) {
          throw new NotFoundError({
            message: 'Boleto not found',
          })
        }

        return boleto.update({
          paid_amount: paidAmount || boleto.paid_amount,
          bank_response_code: bankResponseCode || boleto.bank_response_code,
        })
      })
      .tap((boleto) => {
        logger.info({ status: 'success', metadata: { boleto } })
      })
      .catch(handleDatabaseErrors)
  }

  const index = ({
    page,
    count,
    token,
    title_id, // eslint-disable-line
  }) => {
    const whereQuery = {
      where: {
      },
    }

    const orderQuery = {
      order: [['id', 'DESC']],
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
      orderQuery,
    ])

    return Boleto.findAll(query)
      .catch(handleDatabaseErrors)
  }

  const show = (id) => {
    const query = {
      where: {
        id,
      },
    }

    return Boleto.findOne(query)
      .then((boleto) => {
        if (!boleto) {
          throw new NotFoundError({
            message: 'Boleto not found',
          })
        }

        return boleto
      })
      .catch(handleDatabaseErrors)
  }

  const processBoleto = (item, sqsMessage) => {
    const { boleto_id } = item // eslint-disable-line

    const logger = makeLogger({ operation: 'process_boleto' }, { id: operationId })

    // eslint-disable-next-line
    const removeBoletoFromQueueConditionally = (boleto) => {
      if (boleto.status === 'registered' || boleto.status === 'refused') {
        logger.info({
          sub_operation: 'remove_from_background_queue',
          status: 'started',
          metadata: { boleto_id: boleto.id },
        })
        return BoletosToRegisterQueue.remove(sqsMessage)
          .then(() => {
            logger.info({
              sub_operation: 'remove_from_background_queue',
              status: 'success',
              metadata: { boleto_id: boleto.id },
            })
          })
          .catch((err) => {
            logger.info({
              sub_operation: 'remove_from_background_queue',
              status: 'failed',
              metadata: {
                error_name: err.name,
                error_stack: err.stack,
                error_message: err.message,
              },
            })
            throw err
          })
      }
    }

    // eslint-disable-next-line
    const sendMessageToUserQueueConditionally = (boleto) => {
      if (boleto.status === 'registered' || boleto.status === 'refused') {
        logger.info({
          sub_operation: 'send_message_to_client_queue',
          status: 'started',
          metadata: { boleto_id: boleto.id },
        })

        const params = {
          MessageBody: JSON.stringify({
            boleto_id: boleto.id,
            status: boleto.status,
            reference_id: boleto.reference_id,
          }),
          QueueUrl: boleto.queue_url,
        }

        return sqs.sendMessage(params).promise()
          .then(() => {
            logger.info({
              sub_operation: 'send_message_to_client_queue',
              status: 'success',
              metadata: { boleto_id: boleto.id },
            })
          })
          .catch((err) => {
            logger.info({
              sub_operation: 'send_message_to_client_queue',
              status: 'failed',
              metadata: {
                error_name: err.name,
                error_stack: err.stack,
                error_message: err.message,
              },
            })
            throw err
          })
      }
    }

    logger.info({ status: 'started', metadata: { item } })

    return Promise.resolve(boleto_id)
      .then(registerById)
      .tap(removeBoletoFromQueueConditionally)
      .tap(sendMessageToUserQueueConditionally)
      .tap((response) => {
        logger.info({
          status: 'success',
          metadata: { body: response.body, statusCode: response.statusCode },
        })
      })
      .catch((err) => {
        logger.error({
          status: 'failed',
          metadata: {
            error_name: err.name,
            error_stack: err.stack,
            error_message: err.message,
          },
        })
      })
  }

  return {
    create,
    register,
    registerById,
    update,
    index,
    show,
    processBoleto,
  }
}
