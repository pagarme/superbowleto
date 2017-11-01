import test from 'ava'
import { createBoleto } from '../../../helpers/boleto'
import { register } from '../../../../build/providers/bradesco'

test('register', async (t) => {
  const boleto = await createBoleto()

  const response = await register(boleto)

  t.is(response.status, 'registered')
})
