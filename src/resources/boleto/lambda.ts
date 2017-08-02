import { getEnv } from '../../config/index'
import lambda from '../../lib/lambda'

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

export default {
  register
}
