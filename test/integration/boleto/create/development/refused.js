import test from 'ava'
import cuid from 'cuid'
import { assert } from '../../../../helpers/chai'
import { normalizeHandler } from '../../../../helpers/normalizer'
import { mock } from '../../../../helpers/boleto'
import boletoHandler from '../../../../../src/resources/boleto'
import { createConfig } from '../../../../helpers/configuration'
import database from '../../../../../src/database'

const { Configuration } = database.models
const create = normalizeHandler(boletoHandler.create)
const externalId = cuid()

test.before(async () => {
  await createConfig({
    issuer: 'development',
    external_id: externalId,
  })
})

test.after(async () => {
  await Configuration.destroy({
    where: {
      external_id: externalId,
    },
  })
})

test('creates a boleto (provider refused)', async (t) => {
  const payload = mock

  payload.amount = 5000004
  payload.issuer = 'development'
  payload.external_id = externalId

  const { body, statusCode } = await create({
    body: payload,
  })

  t.is(statusCode, 201)
  t.is(body.object, 'boleto')

  t.true(body.title_id != null)
  t.true(body.barcode != null)
  t.true(typeof body.title_id === 'number')

  assert.containSubset(body, {
    status: 'refused',
    paid_amount: 0,
    amount: payload.amount,
    instructions: payload.instructions,
    issuer: payload.issuer,
    issuer_id: null,
    payer_name: payload.payer_name,
    payer_document_type: payload.payer_document_type,
    payer_document_number: payload.payer_document_number,
    company_name: payload.company_name,
    company_document_number: payload.company_document_number,
    queue_url: payload.queue_url,
    interest: {
      amount: payload.interest.amount,
      days: payload.interest.days,
    },
    fine: {
      amount: payload.fine.amount,
      days: payload.fine.days,
    },
  })
})
