import { getEnv } from '../../config/index'
import lambda from '../../lib/lambda'

function getFullLamdaFunctionName (shortName) {
  const stage = process.env.STAGE || 'test'

  return `superbowleto-${stage}-${shortName}`
}

function register (payload) {
  return lambda.invoke({
    FunctionName: getFullLamdaFunctionName('boleto_register'),
    InvocationType: 'event',
    Payload: JSON.stringify(payload)
  }).promise()
}

export default {
  register
}
