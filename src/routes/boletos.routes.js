const router = require('express').Router()
const { authentication } = require('../middlewares/authentication')

const {
  create,
  index,
  show,
  update,
  defaultHandler,
} = require('../resources/boleto')


router.use('/boletos', authentication)
router.post('/boletos', create)
router.get('/boletos', index)
router.get('/boletos/:id', show)
router.patch('/boletos/:id', update)
router.all('/boletos', defaultHandler)

module.exports = router
