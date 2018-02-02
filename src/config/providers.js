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
      api_key: 'PLACEHOLDER',
      endpoint: 'PLACEHOLDER',
      merchant_id: 'PLACEHOLDER',
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
