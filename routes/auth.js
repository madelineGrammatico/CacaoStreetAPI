const express = require('express')
const authCtrl = require('../controllers/auth')

let router = express.Router()
router.post('/login', authCtrl.loginUser)

module.exports = router