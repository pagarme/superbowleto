import lambda from '../../lib/lambda'
import { getEnv } from '../../config/index'

function getFullLambdaFunctionName (shortName) {
  const stage = process.env.STAGE || 'test'

  return `${stage}-superbowleto-${shortName}`
}

function register (payload) {
  return lambda.invoke({
    FunctionName: getFullLambdaFunctionName('register-boleto'),
    InvocationType: 'event',
    Payload: JSON.stringify(payload)
  }).promise()
}

export default {
  register
}
