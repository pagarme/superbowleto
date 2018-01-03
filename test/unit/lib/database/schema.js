import test from 'ava'
import { defaultCuidValue, responseObjectBuilder } from '../../../../src/lib/database/schema'

test('creates a cuid without prefix', async (t) => {
  const createCuid = defaultCuidValue()
  const cuid = createCuid()

  t.is(typeof createCuid, 'function')
  t.is(typeof cuid, 'string')
  t.is(cuid.length, 25)
})

test('creates a cuid with prefix', async (t) => {
  const prefix = 'test_'
  const prefixLength = prefix.length
  const createCuid = defaultCuidValue(prefix)
  const cuid = createCuid()

  t.is(typeof createCuid, 'function')
  t.is(typeof cuid, 'string')
  t.is(cuid.length, 25 + prefix.length, 'should have a length of 25 without the prefix')
  t.is(cuid.substring(0, prefixLength), 'test_', 'should start with prefix')
})

test('creates a `buildResponse` function and use it on a single item', async (t) => {
  const buildResponse = responseObjectBuilder(id => id + 1)
  const response = await buildResponse(1)

  t.deepEqual(response, 2, 'should have the computed response')
})

test('creates a `buildResponse` function and use it on an array', async (t) => {
  const buildResponse = responseObjectBuilder(id => id + 1)
  const response = await buildResponse([1, 2, 3])

  t.deepEqual(response, [2, 3, 4], 'should have the computed response for each item')
})
