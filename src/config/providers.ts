import { getConfig } from './index'

const config = getConfig({
  development: {
    bradesco: {
      endpoint: 'https://homolog.meiosdepagamentobradesco.com.br/apiregistro/api',
      merchantId: '100005254',
      securityKey: 'bbE9XN8RhOyA9-79HHPnbJ1-Qqy7kzoKGdR-Njmi9fg'
    }
  },
  production: {
    bradesco: {
      endpoint: 'https://meiosdepagamentobradesco.com.br/apiregistro/api',
      merchantId: 'MERCHANT_ID',
      securityKey: 'SECURITY_KEY'
    }
  },
  test: {
    bradesco: {
      endpoint: 'https://homolog.meiosdepagamentobradesco.com.br/apiregistro/api',
      merchantId: '100005254',
      securityKey: 'bbE9XN8RhOyA9-79HHPnbJ1-Qqy7kzoKGdR-Njmi9fg'
    }
  }
})

export default config
