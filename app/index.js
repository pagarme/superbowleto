const express = require('express')
const { json, urlencoded } = require('body-parser')

const PORT = 3000

const app = express()
app.use(json())
app.use(urlencoded({ extended: true }))
app.set('port', PORT)

app.all('/status', (req, res) => {
  res.status(200).send({
    status: 'ok',
    date: new Date()
  })
})

app.get('*', (req, res) => {
  res.sendStatus(404)
})

module.exports = app

