import { prop } from 'ramda'
import getConfig from '../../config/providers'
import { encodeBase64 } from '../../lib/encoding'

const { merchantId, securityKey } = prop('bradesco', getConfig())

export const buildHeaders = () => {
  const authorization = encodeBase64(`${merchantId}:${securityKey}`)

  return {
    Authorization: `Basic ${authorization}`
  }
}
