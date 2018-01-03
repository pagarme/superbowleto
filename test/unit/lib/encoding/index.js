import test from 'ava'
import { encodeBase64, decodeBase64 } from '../../../../src/lib/encoding'

test('encodeBase64', async (t) => {
  const result = encodeBase64('bowie')

  t.is(result, 'Ym93aWU=', 'should have encoded the string')
})

test('decodeBase64', async (t) => {
  const result = decodeBase64('Ym93aWU=')

  t.is(result, 'bowie', 'should have decoded the string')
})

