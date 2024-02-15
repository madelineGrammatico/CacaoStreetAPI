const express = require('express')

const chocolateCtrl = require('../controllers/chocolate')
const checkTokenMiddleware = require('../jsonwebtoken/check')

const router = express.Router()

router.get('/', chocolateCtrl.getAllChocolates)

router.get('/:id', chocolateCtrl.getChocolate)

router.post('', checkTokenMiddleware, chocolateCtrl.addChocolate)

router.patch("/:id", checkTokenMiddleware,chocolateCtrl.updateChocolate)

router.delete("/:id",checkTokenMiddleware, chocolateCtrl.deleteChocolate)

module.exports = router