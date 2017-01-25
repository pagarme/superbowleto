import express from 'express'
import { json, urlencoded } from 'body-parser'
import { createServer } from 'http'

const PORT = 3000
const environment = process.env.API_ENV
const app = express()

app.use(json())
app.use(urlencoded({ extended: true }))
app.set('port', PORT)

app.all('/status', (req, res) => {
  res.status(200).send({
    environment,
    status: 'ok',
    date: new Date()
  })
})

app.get('*', (req, res) => {
  res.sendStatus(404)
})

export const server = createServer(app)

server.listen(PORT)

