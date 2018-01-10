const express = require('express')

const app = express()

const { PORT = 3000 } = process.env

app.get('/', (req, res) => res.json({ ok: 'ok' }))

app.listen(
  PORT,
  () => console.log(`Superbowleto listening on port: ${PORT}`)
)
