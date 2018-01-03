const encodeBase64 = str => Buffer.from(`${str}`).toString('base64')

const decodeBase64 = str => Buffer.from(`${str}`, 'base64').toString('ascii')

module.exports = {
  encodeBase64,
  decodeBase64,
}
