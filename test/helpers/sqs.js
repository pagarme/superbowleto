import Promise from 'bluebird'
import { compose, defaultTo, filter, inc, prop } from 'ramda'
import sqs from '../../src/lib/sqs'

export const purgeQueue = queue => sqs.purgeQueue({
  QueueUrl: queue.options.endpoint
}).promise()

export const findItemOnQueue = (where, queue) => {
  const MAX_LOOP_COUNT = 6
  let loopCount = 0

  const receiveMessage = () => sqs.receiveMessage({
    QueueUrl: queue.options.endpoint,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 10
  }).promise()

  const parseMessages = compose(
    JSON.parse,
    prop('Body')
  )

  const filterMessages = filter(where)

  const runAgain = (messages) => {
    if (messages.length > 0) {
      return messages[0]
    }

    if (loopCount > MAX_LOOP_COUNT) {
      return []
    }

    return Promise.delay(1000)
      .then(pollItems) // eslint-disable-line no-use-before-define
  }

  const pollItems = () => {
    loopCount = inc(loopCount)

    return Promise.resolve()
      .then(receiveMessage)
      .then(prop('Messages'))
      .then(defaultTo([]))
      .map(parseMessages)
      .then(filterMessages)
      .then(runAgain)
  }

  return pollItems()
}
