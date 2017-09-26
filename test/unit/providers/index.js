import test from 'ava'
import { findProvider } from '../../../build/providers'
import * as bradesco from '../../../build/providers/bradesco'
import * as development from '../../../build/providers/development'
import { NotFoundError } from '../../../build/lib/errors/index'

test('findProvider: with bradesco provider', (t) => {
  const bradescoProvider = findProvider('bradesco')

  t.deepEqual(bradescoProvider, bradesco, 'should return the bradesco provider')
})

test('findProvider: with development provider', (t) => {
  const developmentProvider = findProvider('development')

  t.deepEqual(developmentProvider, development, 'should return the development provider')
})

test('findProvider: with no existing provider', (t) => {
  const tryToGetProvider = () => findProvider('santander')

  t.throws(
    tryToGetProvider,
    NotFoundError,
    'Provider not found',
    'should throw an error'
  )
})
