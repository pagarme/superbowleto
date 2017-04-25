import test from 'ava'
import { createBoleto } from '../../../helpers/boleto'
import { register, verifyRegistrationStatus } from '../../../../build/providers/bradesco'

test('register', async (t) => {
  const boleto = await createBoleto()

  const response = await register(boleto)

  t.is(response.status, 'registered')
})

test('verifyRegistrationStatus', async (t) => {
  const boleto = await createBoleto()
  boleto.issuer_id = boleto.title_id

  await register(boleto)

  const response = await verifyRegistrationStatus(boleto)

  t.is(response.status, 'registered')
})
