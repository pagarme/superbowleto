const express = require('express')

const { defaultResourceHandler } = require('../resources')

const app = express()
const routes = require('../routes/index.routes')

app.use(express.json(), routes)

app.disable('x-powered-by')
app.all('*', defaultResourceHandler)

module.exports = app
