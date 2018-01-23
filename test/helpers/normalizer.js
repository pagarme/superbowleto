import { merge } from 'ramda'

const populateReq = merge({
  get: (headerName) => {
    const headers = {
      'x-request-id': 'req_a872b1c123',
    }

    return headers[headerName]
  },
  query: {},
  params: {},
  body: {},
})

const createMockRes = () => ({
  status: () => ({
    send: () => undefined,
  }),
})

const createMockNext = () => () => {}

export const normalizeHandler = handler => (req = {}) =>
  handler(populateReq(req), createMockRes(), createMockNext())
