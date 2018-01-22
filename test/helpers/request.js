import Promise from 'bluebird'
import axios from 'axios'
import {
  applySpec,
  defaultTo,
  pick,
  prop,
  toLower,
} from 'ramda'

const pickValuesFromResponse = pick([
  'data',
  'status',
  'headers',
])

const transformResponseProps = applySpec({
  body: prop('data'),
  statusCode: prop('status'),
  headers: prop('headers'),
})

const defaultToEmptyObject = defaultTo({})

const request = ({
  method,
  route,
  headers,
  data,
  query,
}) =>
  Promise.resolve({
    url: `http://superbowleto-web:3000${route}`,
    method: toLower(method),
    headers: defaultToEmptyObject(headers),
    data: defaultToEmptyObject(data),
    query: defaultToEmptyObject(query),
  })
    .then(axios.request)
    .then(pickValuesFromResponse)
    .catch(prop('response'))
    .then(transformResponseProps)

export default request
