import Promise from 'bluebird'
import { compose, defaultTo, prop } from 'ramda'
import sqs from './index'

class Queue {
  constructor ({ queueUrl, concurrency = 10 } = {}) {
    this.queueUrl = queueUrl
    this.concurrency = concurrency
  }

  sendMessage (body) {
    return sqs.sendMessage({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(body)
    }).promise()
  }

  deleteMessage (message) {
    return sqs.deleteMessage({
      queueUrl: this.queueUrl,
      ReceiptHandle: message.ReceiptHandle
    }).promise()
  }

  receiveMessage () {
    const getMessages = compose(
      defaultTo([]),
      prop('Messages')
    )

    const parseMessage = compose(
      JSON.parse,
      prop('Body')
    )

    return Promise.resolve()
      .then(() => sqs.receiveMessage({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: this.concurrency
      }).promise())
      .then(getMessages)
      .map(parseMessage)
  }
}

export default Queue
