import test from 'ava'
import { buildResponse } from '../../../../src/resources/queue/model'

test('buildResponse', async (t) => {
  const now = new Date()

  const input = {
    id: 'queue_cizec29zt000001tgv3qnv3ug',
    name: 'test',
    url: 'http://yopa/queue/test',
    created_at: now,
    updated_at: now,
    secret_field: 'this is secret'
  }

  const output = await buildResponse(input)

  t.true(output.secret_field == null, 'should not have a `secret_field` prop')
  t.deepEqual(output, {
    object: 'queue',
    id: 'queue_cizec29zt000001tgv3qnv3ug',
    name: 'test',
    url: 'http://yopa/queue/test',
    created_at: now,
    updated_at: now
  })
})
