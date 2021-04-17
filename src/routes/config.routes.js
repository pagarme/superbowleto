const router = require('express').Router()
const { authentication } = require('../middlewares/authentication')

const {
  create: createConfig,
  update: updateConfig,
  show: showConfig,
} = require('../resources/configuration/index')

router.use('/configurations', authentication)
router.post('/configurations', createConfig)
router.patch('/configurations/:id', updateConfig)
router.get('/configurations/:external_id', showConfig)

module.exports = router
