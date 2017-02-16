import test from 'ava'
import { defaultCuidValue } from '../../../src/lib/schema'

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
