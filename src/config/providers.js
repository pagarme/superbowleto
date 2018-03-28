const { getConfig } = require('./index')

const config = getConfig({
  development: {
    bradesco: {
      api_key: 'bbE9XN8RhOyA9-79HHPnbJ1-Qqy7kzoKGdR-Njmi9fg',
      endpoint: 'https://homolog.meiosdepagamentobradesco.com.br/apiregistro/api',
      merchant_id: '100005254',
    },
  },
  production: {
    bradesco: {
      api_key: process.env.BRADESCO_API_KEY,
      endpoint: process.env.BRADESCO_ENDPOINT,
      merchant_id: process.env.BRADESCO_MERCHANT_ID,
    },
  },
  test: {
    bradesco: {
      api_key: 'bbE9XN8RhOyA9-79HHPnbJ1-Qqy7kzoKGdR-Njmi9fg',
      endpoint: 'https://homolog.meiosdepagamentobradesco.com.br/apiregistro/api',
      merchant_id: '100005254',
    },
  },
})

module.exports = config
