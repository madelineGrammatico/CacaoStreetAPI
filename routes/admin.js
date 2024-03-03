const express = require('express')

const adminCtrl = require('../controllers/admin')
// const checkAdminMiddleware = require('../jsonwebtoken/checkAdmin')

let router = express.Router()

router.get('/', adminCtrl.getAllAdmins)

router.get('/:id', adminCtrl.getAdmin)

router.post('', adminCtrl.addAdmin)

router.patch("/:id", adminCtrl.updateAdmin)
   
// router.patch("/untrash/:id", checkAdminMiddleware, adminCtrl.untrashAdmin)

// router.delete("/trash/:id", checkAdminMiddleware, adminCtrl.trashAdmin)

router.delete("/:id", adminCtrl.deleteAdmin)

module.exports = router