import database from '../../../src/database'
import { buildModelResponse } from '../../../src/resources/configuration/model'

const { Configuration } = database.models

export const mock = {
  issuer_account: '120569',
  issuer_agency: '1229',
  issuer_wallet: '26',
}

export const createConfig = async (data = {}) => {
  const payload = Object.assign({}, mock, data)

  const configuration = await Configuration.create(payload)
  return buildModelResponse(configuration)
}
