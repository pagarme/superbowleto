import test from 'ava'
import R from 'ramda'
import { createBoleto } from './helpers'
import { register } from '../../../src/resources/boleto/service'

let boleto

test.before(async () => {
  boleto = await createBoleto()
})

test.only('register', async (t) => {
  Promise.resolve(boleto)
    .then(x => ({
      boleto_id: x.id,
      issuer: x.issuer
    }))
    .then(register)
    .then(console.log)
})
