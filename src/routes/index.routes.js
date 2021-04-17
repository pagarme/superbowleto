const router = require('express').Router()

const boletos = require('./boletos.routes')
const config = require('./config.routes')
const util = require('./util.routes')
const redirectHttp = require('../middlewares/redirect-http')

const allRoutesExceptHealthCheck = /^\/(?!_health_check(\/|$)).*$/i

router.use(boletos)
router.use(config)
router.use(util)

router.use(allRoutesExceptHealthCheck, redirectHttp)

module.exports = router
