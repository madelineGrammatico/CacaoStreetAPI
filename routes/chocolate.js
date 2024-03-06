const express = require('express')

const chocolateCtrl = require('../controllers/chocolate')
// const checkTokenMiddleware = require('../jsonwebtoken/checkUser')
const { authJwt } = require("../middleware");

const router = express.Router()

router.get('/', chocolateCtrl.getAllChocolates)

router.get('/:id', chocolateCtrl.getChocolate)

router.post('', [authJwt.verifyToken], chocolateCtrl.addChocolate)

router.patch("/:id", [authJwt.verifyToken], chocolateCtrl.updateChocolate)

router.delete("/:id", [authJwt.verifyToken], chocolateCtrl.deleteChocolate)

module.exports = router