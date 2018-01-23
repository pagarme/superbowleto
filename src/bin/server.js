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

const app = express()

const { PORT = 3000 } = process.env

app.use(bodyParser.json())

app.get('/', (req, res) => res.json({ ok: 'ok' }))

app.use('/boletos', authentication)
app.post('/boletos', create)
app.get('/boletos', index)
app.get('/boletos/:id', show)
app.patch('/boletos/:id', update)
app.all('/boletos', defaultHandler)

app.all('*', defaultResourceHandler)

app.listen(
  PORT,
  () => console.log(`Superbowleto listening on port: ${PORT}`)
)
