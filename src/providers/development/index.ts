import * as Promise from 'bluebird'
import { always, cond, equals, T } from 'ramda'
import { makeFromLogger } from '../../lib/logger'

const makeLogger = makeFromLogger('development/index')

export const register = (boleto) => {
  const getStatusFromAmount = cond([
    [equals(5000003), always('pending_registration')],
    [equals(5000004), always('refused')],
    [T, always('registered')]
  ])

  const logger = makeLogger({ operation: 'register' })

  return Promise.resolve(boleto)
    .then(bol => ({
      status: getStatusFromAmount(bol.amount)
    }))
    .tap((response) => {
      logger.info({
        status: 'success',
        metadata: {
          status: response.status,
          data: response.data
        }
      })
    })
    .tapCatch(err => logger.error({ status: 'failed', metadata: { err } }))
}
