import { getConfig } from './index'

const config = getConfig({
  development: {
    'boletos-to-register': {
      concurrency: 10,
      queueUrl: `http://${process.env.SQS_HOST || 'yopa'}:47195/queue/boletos-to-register`
    }
  },
  production: {
    'boletos-to-register': {
      concurrency: 10,
      queueUrl: process.env.BOLETOS_TO_REGISTER_QUEUE_URL
    }
  },
  test: {
    'boletos-to-register': {
      concurrency: 10,
      queueUrl: `http://${process.env.SQS_HOST || 'yopa'}:47195/queue/boletos-to-register`
    }
  }
})

export default config
