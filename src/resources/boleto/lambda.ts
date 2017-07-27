import lambda from '../../lib/lambda'
import { getEnv } from '../../config/index'

function getFullLambdaFunctionName (shortName) {
  const stage = process.env.STAGE || 'test'

  return `${stage}-superbowleto-${shortName}`
}

function register (payload) {
  console.log(process.env)
  return lambda.invoke({
    FunctionName: getFullLambdaFunctionName('register-boleto'),
    InvocationType: 'Event',
    Payload: JSON.stringify(payload)
  }).promise()
}

export default {
  register
}
