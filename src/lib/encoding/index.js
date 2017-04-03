export const encodeBase64 = str => Buffer.from(`${str}`).toString('base64')

export const decodeBase64 = str => Buffer.from(`${str}`, 'base64').toString('ascii')
