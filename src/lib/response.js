export const buildResponse = (statusCode = 200, data = {}) => ({
  statusCode,
  body: JSON.stringify(data)
})
