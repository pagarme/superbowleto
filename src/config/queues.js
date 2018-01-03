const { getConfig } = require('./index')

const config = getConfig({
  development: {
    'boletos-to-register': {
      queueUrl: `http://${process.env.SQS_HOST || 'yopa'}:47195/queue/boletos-to-register`,
      concurrency: 10,
    },
  },
  production: {
    'boletos-to-register': {
      queueUrl: process.env.BOLETOS_TO_REGISTER_QUEUE_URL,
      concurrency: 10,
    },
  },
  test: {
    'boletos-to-register': {
      queueUrl: `http://${process.env.SQS_HOST || 'yopa'}:47195/queue/boletos-to-register`,
      concurrency: 10,
    },
  },
})

module.exports = config

