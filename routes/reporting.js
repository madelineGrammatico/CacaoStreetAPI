const express = require('express')

const reportingCtrl = require('../controllers/reporting')
const { authJwt } = require('../middleware')

const router = express.Router()

router.get('/', [authJwt.verifyToken, authJwt.isAdmin], reportingCtrl.getAllReportings)

router.get('/:id', [authJwt.verifyToken], reportingCtrl.getReporting)

router.post('', [authJwt.verifyToken], reportingCtrl.addReporting)

router.patch("/:id", [authJwt.verifyToken], reportingCtrl.updateReporting)

router.delete("/:id", [authJwt.verifyToken], reportingCtrl.deleteReporting)

module.exports = router