const express = require('express')
const authCtrl = require('../controllers/auth')

let router = express.Router()
router.post('/login_user', authCtrl.loginUser)
router.post('/login_admin', authCtrl.loginAdmin)

module.exports = router