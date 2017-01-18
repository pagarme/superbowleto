const { createServer } = require('http')
const app = require('../app')

const port = app.get('port')
const server = createServer(app)

server.listen(port)

