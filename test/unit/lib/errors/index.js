import test from 'ava'
import { NotFoundError } from '../../../../src/lib/errors'

test('is a custom error', async (t) => {
  const error = new NotFoundError({
    message: 'User not found'
  })

  t.is(error.name, 'NotFoundError', 'has a `name` property')
  t.is(error.type, 'not_found', 'has a `type` property')
  t.is(error.message, 'User not found', 'has a `message` property')
  t.true(error instanceof NotFoundError, 'in an instance of an error')
})
