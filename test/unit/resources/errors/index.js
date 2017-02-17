import test from 'ava'
import { NotFoundError } from '../../../../src/resources/errors'

test('is a custom error', async (t) => {
  const error = new NotFoundError({
    message: 'User not found',
    customProperty: 'metadata'
  })

  t.is(error.name, 'NotFoundError')
  t.is(error.type, 'not_found')
  t.is(error.message, 'User not found')
  t.is(error.customProperty, 'metadata')
  t.true(error instanceof NotFoundError)
})
