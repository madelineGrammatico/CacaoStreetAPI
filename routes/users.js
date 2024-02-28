const express = require('express')

const userCtrl = require('../controllers/user')
const checkTokenMiddleware = require('../jsonwebtoken/checkUser')
const checkAdminMiddleware = require('../jsonwebtoken/checkAdmin')

let router = express.Router()

router.get('/', (req, res, next) => checkAdminMiddleware( req, res, next, false), userCtrl.getAllUsers)

router.get('/:id', (req, res, next) => checkTokenMiddleware( req, res, next, false), userCtrl.getUser)

router.post('', userCtrl.addUser)

router.patch("/:id", checkTokenMiddleware, userCtrl.updateUser)
   
router.patch("/untrash/:id", checkTokenMiddleware, userCtrl.untrashUser)

router.delete("/trash/:id", checkTokenMiddleware, userCtrl.trashUser)

router.delete("/:id",checkTokenMiddleware, userCtrl.deleteUser)

module.exports = router