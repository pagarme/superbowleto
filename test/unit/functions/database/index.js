import test from 'ava'
import sinon from 'sinon'
import Promise from 'bluebird'
import { DatabaseError } from '../../../../src/lib/errors'
import { ensureDatabaseIsConnected } from '../../../../src/functions/database'

test('ensure database is connected when authentication succeeded', async (t) => {
  const mockDatabase = {
    authenticate: sinon.stub().returns(Promise.resolve()),
  }

  await t.notThrows(() => ensureDatabaseIsConnected(mockDatabase))
})

test('ensure database is not connected when authentication fails', async (t) => {
  const mockError = new Error('mock message')
  const mockDatabase = {
    authenticate: sinon.stub().returns(Promise.reject(mockError)),
  }

  const result = ensureDatabaseIsConnected(mockDatabase)

  const error = await t.throws(result, DatabaseError)

  t.is(error.message, mockError.message)
})
