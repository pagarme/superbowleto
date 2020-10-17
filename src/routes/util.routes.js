const router = require('express').Router()


router.get('/robots.txt', (req, res) => res.send(200, 'User-Agent: *\nDisallow: /'))
router.get('/_health_check', (req, res) => res.send(200))


router.headersTimeout = 65 * 1000
router.keepAliveTimeout = 61 * 1000
router.timeout = 60 * 1000

module.exports = router
