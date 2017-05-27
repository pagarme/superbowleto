import test from 'ava'
import { findProvider } from '../../../build/providers'
import * as bradesco from '../../../build/providers/bradesco'

test('findProvider: with existing provider', (t) => {
  const provider = findProvider('bradesco')

  t.deepEqual(provider, bradesco, 'should return the right provider')
})

test('findProvider: with no existing provider', (t) => {
  const tryToGetProvider = () => findProvider('santander')

  t.throws(
    tryToGetProvider,
    Error,
    'Provider not found',
    'should throw an error'
  )
})
