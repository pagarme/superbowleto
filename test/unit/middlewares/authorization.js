import test from 'ava'
import { isAuthorized } from '../../../src/middlewares/authentication'
import { AuthorizationError } from '../../../src/lib/errors'

test('should authorize', async (t) => {
  const mock = true
  await t.notThrows(() => isAuthorized(mock))
})

test('should not authorize', async (t) => {
  const mock = false
  const result = isAuthorized(mock)
  const error = await t.throws(result, AuthorizationError)
  t.is(error.message, 'Unauthorized')
})
