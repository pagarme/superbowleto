import test from 'ava'
import { createBoleto } from '../../../helpers/boleto'
import Provider from '../../../../src/providers/bradesco'

const { register } = Provider.getProvider()

test.skip('register', async (t) => {
  const boleto = await createBoleto()

  const response = await register(boleto)

  t.is(response.status, 'registered')
})
