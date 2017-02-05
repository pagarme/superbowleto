import test from 'ava'
import * as boleto from '../../src/services/boleto'

test('creates a boleto', async (t) => {
  const { message, id, data } = await boleto.create({ id: 123 })

  t.true(id != null)
  t.true(data != null)
  t.is(message, 'Boleto created successfully')
})

test('shows a boleto', async (t) => {
  const { id, public_url } = await boleto.show(123)

  t.is(id, 'bol_123')
  t.is(public_url, 'https://superbowleto.pagar.me/boletos/token_123')
})
