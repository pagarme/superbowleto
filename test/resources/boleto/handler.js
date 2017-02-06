import test from 'ava'
import { promisify } from 'bluebird'
import * as boleto from '../../../src/resources/boleto/handler'

const create = promisify(boleto.create)
const show = promisify(boleto.show)

test('creates a boleto', async (t) => {
  const { statusCode, body } = await create({}, {})

  t.is(statusCode, 201)
  t.is(typeof body, 'string')
  t.notThrows(() => JSON.parse(body), 'should be a valid JSON string')
})

test('shows a boleto', async (t) => {
  const { statusCode, body } = await show({}, {})

  t.is(statusCode, 200)
  t.is(typeof body, 'string')
  t.notThrows(() => JSON.parse(body), 'should be a valid JSON string')
})
