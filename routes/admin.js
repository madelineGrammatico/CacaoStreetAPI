const express = require('express')

const adminCtrl = require('../controllers/admin')
const checkAdminMiddleware = require('../jsonwebtoken/checkAdmin')

let router = express.Router()

router.get('/', checkAdminMiddleware, adminCtrl.getAllAdmins)

router.get('/:id', checkAdminMiddleware, adminCtrl.getAdmin)

router.post('', adminCtrl.addAdmin)

router.patch("/:id", checkAdminMiddleware, adminCtrl.updateAdmin)
   
// router.patch("/untrash/:id", checkAdminMiddleware, adminCtrl.untrashAdmin)

// router.delete("/trash/:id", checkAdminMiddleware, adminCtrl.trashAdmin)

router.delete("/:id",checkAdminMiddleware, adminCtrl.deleteAdmin)

module.exports = router