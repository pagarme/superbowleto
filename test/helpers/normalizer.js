import { promisify } from 'bluebird'

const parseHandlerEvent = event => Object.assign({}, event, {
  body: JSON.parse(event.body),
})

const computeHandlerEvent = event => Object.assign({}, event, {
  headers: {
    'x-request-id': 'req_a872b1c123',
  },
  body: JSON.stringify(event.body),
})

export const normalizeHandler = fn => (event = {}, context) => {
  const handler = promisify(fn)
  const computedEvent = computeHandlerEvent(event)

  return handler(computedEvent, context)
    .then(parseHandlerEvent)
}
