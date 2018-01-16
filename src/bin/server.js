const express = require('express')
const bodyParser = require('body-parser')
const {
  create,
  index,
  show,
  update,
} = require('../resources/boleto')

const app = express()

const { PORT = 3000 } = process.env

app.use(bodyParser.json())

app.get('/', (req, res) => res.json({ ok: 'ok' }))

app.post('/boletos', create)
app.get('/boletos', index)
app.get('/boletos/:id', show)
app.patch('/boletos/:id', update)

app.listen(
  PORT,
  () => console.log(`Superbowleto listening on port: ${PORT}`)
)
