const express = require('express')

const reportingCtrl = require('../controllers/reporting')
const checkTokenMiddleware = require('../jsonwebtoken/checkUser')
const checkAdminMiddleware = require('../jsonwebtoken/checkAdmin')

const router = express.Router()

router.get('/', checkAdminMiddleware, reportingCtrl.getAllReportings)

router.get('/:id', checkTokenMiddleware, reportingCtrl.getReporting)

router.post('', checkTokenMiddleware, reportingCtrl.addReporting)

router.patch("/:id", checkTokenMiddleware, reportingCtrl.updateReporting)

router.delete("/:id", checkTokenMiddleware, reportingCtrl.deleteReporting)

module.exports = router