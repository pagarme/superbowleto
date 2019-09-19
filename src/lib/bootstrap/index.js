const dotenv = require('dotenv')

const initializeDotEnv = () => {
  if (process.env.NODE_ENV === 'production' && process.env.DOTENV_PATH) {
    dotenv.config({ path: process.env.DOTENV_PATH })
  }
}

module.exports = initializeDotEnv
