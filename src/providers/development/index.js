const Promise = require('bluebird')
const {
  always,
  cond,
  equals,
  T,
} = require('ramda')
const { makeFromLogger } = require('../../lib/logger')

const makeLogger = makeFromLogger('development/index')

const getProvider = () => {
  const register = (boleto) => {
    const getStatusFromAmount = cond([
      [equals(5000003), always('pending_registration')],
      [equals(5000004), always('refused')],
      [T, always('registered')],
    ])

    const logger = makeLogger({ operation: 'register' })

    return Promise.resolve(boleto)
      .then(bol => ({
        status: getStatusFromAmount(bol.amount),
      }))
      .tap((response) => {
        logger.info({
          status: 'success',
          metadata: {
            status: response.status,
            data: response.data,
          },
        })
      })
      .tapCatch(err => logger.error({
        status: 'failed',
        metadata: {
          error_name: err.name,
          error_stack: err.stack,
          error_message: err.message,
        },
      }))
  }

  return {
    register,
  }
}

module.exports = {
  getProvider,
}
