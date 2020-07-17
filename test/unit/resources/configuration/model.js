import test from 'ava'
import {
  buildModelResponse,
} from '../../../../src/resources/configuration/model'

test('buildResponse', async (t) => {
  const now = new Date()

  const input = {
    id: 'cf_niskhinfjsihfjisALINETHORjmsijdisaf',
    external_id: 'morganaskolatropa',
    issuer_account: '469',
    issuer_agency: '1229',
    issuer_wallet: '26',
    issuer: 'bradesco',
    created_at: now,
    updated_at: now,
    what_is_that: 'this is secret',
  }

  const output = await buildModelResponse(input)

  t.true(output.what_is_that == null, 'should not have a `what_is_that` prop')

  t.deepEqual(output, {
    object: 'configuration',
    id: 'cf_niskhinfjsihfjisALINETHORjmsijdisaf',
    external_id: 'morganaskolatropa',
    issuer_account: '469',
    issuer_agency: '1229',
    issuer_wallet: '26',
    issuer: 'bradesco',
    created_at: now,
    updated_at: now,
  }, 'should be a configuration object')
})
