const { forEachObjIndexed, curry } = require('ramda')

const shutdown = (process, server, value) => () =>
  server.close(() => process.exit(128 + value))

const shutdownEvent = (process, server) => (value, signal) =>
  process.on(signal, shutdown(process, server, value))

const setupGracefulShutdown = curry((process, server) => {
  const signals = {
    SIGHUP: 1,
    SIGINT: 2,
    SIGTERM: 15,
  }

  forEachObjIndexed(shutdownEvent(process, server), signals)
})

module.exports = {
  setupGracefulShutdown,
  shutdown,
  shutdownEvent,
}
