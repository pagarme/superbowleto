const lambda = require('../../lib/lambda')
const { getEnv } = require('../../config/index')

function getFullLambdaFunctionName (shortName) {
  const stage = process.env.STAGE || 'test'

  return `${stage}-superbowleto-${shortName}`
}

function register (payload) {
  return lambda.invoke({
    FunctionName: getFullLambdaFunctionName('register-boleto'),
    InvocationType: 'Event',
    Payload: JSON.stringify(payload)
  }).promise()
}

module.exports = {
  register
}
