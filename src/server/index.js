const express = require('express')
const bodyParser = require('body-parser')

const { authentication } = require('../middlewares/authentication')
const {
  create,
  index,
  show,
  update,
  defaultHandler,
} = require('../resources/boleto')
const { defaultResourceHandler } = require('../resources')
const redirectHttp = require('../middlewares/redirect-http')

const app = express()
const allRoutesExceptHealthCheck = /^\/(?!_health_check(\/|$)).*$/i


app.use(bodyParser.json())

app.disable('x-powered-by')
app.get('/robots.txt', (req, res) => res.send(200, 'User-Agent: *\nDisallow: /'))
app.get('/_health_check', (req, res) => res.send(200))
app.use(allRoutesExceptHealthCheck, redirectHttp)
app.use('/boletos', authentication)
app.post('/boletos', create)
app.get('/boletos', index)
app.get('/boletos/:id', show)
app.patch('/boletos/:id', update)
app.all('/boletos', defaultHandler)

app.all('*', defaultResourceHandler)

app.headersTimeout = 65 * 1000
app.keepAliveTimeout = 61 * 1000
app.timeout = 60 * 1000

module.exports = app
