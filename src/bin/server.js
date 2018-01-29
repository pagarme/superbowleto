const { PORT = 3000 } = process.env

const app = require('../server')
const { setupGracefulShutdown } = require('../server/shutdown')

const server = app.listen(
  PORT,
  () => console.log(`Superbowleto listening on port: ${PORT}`)
)

setupGracefulShutdown(process, server)
