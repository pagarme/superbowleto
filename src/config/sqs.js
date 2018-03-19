const { getConfig } = require('./')

const config = getConfig({
  development: {
    endpoint: `http://${process.env.SQS_HOST || 'yopa'}:47195`,
    region: 'yopa-local',
  },
  production: {
    endpoint: 'sqs.us-east-1.amazonaws.com',
    region: 'us-east-1',
  },
  test: {
    endpoint: `http://${process.env.SQS_HOST || 'yopa'}:47195`,
    region: 'yopa-local',
  },
})

module.exports = config
