const express = require('express')
const { json, urlencoded } = require('body-parser')

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

module.exports = app

