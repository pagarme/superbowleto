import Promise from 'bluebird'
import sqs from '../../src/lib/sqs'

export const purgeQueue = queue => sqs.purgeQueue({
  QueueUrl: queue.options.endpoint,
}).promise()

export const findItemOnQueue = (queue, where) =>
  new Promise((resolve) => {
    // eslint-disable-next-line
    queue.startProcessing((item) => {
      if (where(item)) {
        queue.stopProcessing()
        return resolve(item)
      }
    })
  })
