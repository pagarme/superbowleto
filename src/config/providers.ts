import { getConfig } from './index'

const config = getConfig({
  development: {
    bradesco: {
      endpoint: 'https://homolog.meiosdepagamentobradesco.com.br/apiregistro/api'
    }
  },
  production: {
    bradesco: {
      endpoint: process.env.STAGE === 'sandbox'
        ? 'https://homolog.meiosdepagamentobradesco.com.br/apiregistro/api'
        : 'https://meiosdepagamentobradesco.com.br/apiregistro/api'
    }
  },
  test: {
    bradesco: {
      endpoint: 'https://homolog.meiosdepagamentobradesco.com.br/apiregistro/api'
    }
  }
})

export default config
