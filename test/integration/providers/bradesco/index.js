import test from 'ava'
import { createBoleto } from '../../../helpers/boleto'
import * as Provider from '../../../../build/providers/bradesco'

const { register } = Provider.getProvider()

test('register', async (t) => {
  const boleto = await createBoleto()

  const response = await register(boleto)

  t.is(response.status, 'registered')
})
