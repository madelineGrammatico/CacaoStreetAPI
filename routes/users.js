const express = require('express')

const userCtrl = require('../controllers/user')
const checkTokenMiddleware = require('../jsonwebtoken/check')

let router = express.Router()

router.get('/', checkTokenMiddleware, userCtrl.getAllUsers)

router.get('/:id', checkTokenMiddleware, userCtrl.getUser)

router.post('', userCtrl.addUser)

router.patch("/:id", checkTokenMiddleware,userCtrl.updateUser)
   
router.patch("/untrash/:id", checkTokenMiddleware, userCtrl.untrashUser)
router.delete("/trash/:id", checkTokenMiddleware, userCtrl.trashUser)

router.delete("/:id",checkTokenMiddleware, userCtrl.deleteUser)

module.exports = router