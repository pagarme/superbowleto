const { getConfig } = require('./index')

const config = getConfig({
  development: {
    bradesco: {
      api_key: 'bbE9XN8RhOyA9-79HHPnbJ1-Qqy7kzoKGdR-Njmi9fg',
      endpoint: 'https://homolog.meiosdepagamentobradesco.com.br/apiregistro/api',
      merchant_id: '100005254',
    },
    'boleto-api-bradesco-shopfacil': {
      boleto_api_password: 'FAKEPWD',
      boleto_api_user: 'FAKEUSR',
      username: '100005254',
      password: 'bbE9XN8RhOyA9-79HHPnbJ1-Qqy7kzoKGdR-Njmi9fg',
      endpoint: 'https://stgboleto.mundipagg.com/v1/boleto/register',
    },
    'boleto-api-caixa': {
      boleto_api_password: 'FAKEPWDCAIXA',
      boleto_api_user: 'FAKEUSRCAIXA',
      endpoint: 'https://stgboleto.mundipagg.com/v1',
    },
  },
  production: {
    bradesco: {
      api_key: process.env.BRADESCO_API_KEY,
      endpoint: process.env.BRADESCO_ENDPOINT,
      merchant_id: process.env.BRADESCO_MERCHANT_ID,
    },
    'boleto-api-bradesco-shopfacil': {
      boleto_api_password: process.env.BOLETO_API_PASSWORD,
      boleto_api_user: process.env.BOLETO_API_USER,
      username: process.env.BOLETO_API_BRADESCO_SHOPFACIL_USERNAME,
      password: process.env.BOLETO_API_BRADESCO_SHOPFACIL_PASSWORD,
      endpoint: process.env.BOLETO_API_ENDPOINT,
    },
    'boleto-api-caixa': {
      boleto_api_password: process.env.BOLETO_API_PASSWORD,
      boleto_api_user: process.env.BOLETO_API_USER,
      endpoint: process.env.BOLETO_API_ENDPOINT,
    },
  },
  test: {
    bradesco: {
      api_key: 'bbE9XN8RhOyA9-79HHPnbJ1-Qqy7kzoKGdR-Njmi9fg',
      endpoint: 'https://homolog.meiosdepagamentobradesco.com.br/apiregistro/api',
      merchant_id: '100005254',
    },
    'boleto-api-bradesco-shopfacil': {
      boleto_api_password: 'FAKEPWD',
      boleto_api_user: 'FAKEUSR',
      username: '100005254',
      password: 'bbE9XN8RhOyA9-79HHPnbJ1-Qqy7kzoKGdR-Njmi9fg',
      endpoint: 'https://stgboleto.mundipagg.com/v1',
    },
    'boleto-api-caixa': {
      boleto_api_password: 'FAKEPWDCAIXA',
      boleto_api_user: 'FAKEUSRCAIXA',
      endpoint: 'https://stgboleto.mundipagg.com/v1',
    },
  },
})

module.exports = config
