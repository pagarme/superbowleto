import test from 'ava'
import { getPaginationQuery } from '../../../../src/lib/database/pagination'

test('creates a pagination with defaults', async (t) => {
  const pagination = getPaginationQuery()

  t.deepEqual(pagination, {
    limit: 10,
    offset: 0,
  })
})

test('creates a pagination with `page = 3` and `count = 15`', async (t) => {
  const pagination = getPaginationQuery({
    page: 3,
    count: 15,
  })

  t.deepEqual(pagination, {
    limit: 15,
    offset: 30,
  })
})
