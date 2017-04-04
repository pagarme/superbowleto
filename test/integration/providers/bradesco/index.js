import test from 'ava'
import { buildHeaders } from '../../../../src/providers/bradesco'

test('buildHeaders', (t) => {
  const headers = buildHeaders()

  t.deepEqual(headers, {
    Authorization: 'Basic MTAwMDA1MjU0OmJiRTlYTjhSaE95QTktNzlISFBuYkoxLVFxeTdrem9LR2RSLU5qbWk5Zmc='
  })
})

