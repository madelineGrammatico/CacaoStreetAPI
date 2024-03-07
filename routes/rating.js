const express = require('express')
const { authJwt } = require("../middleware");
// const commentCtrl = require('../controllers/comment')

const router = express.Router()

router.get('/', [authJwt.verifyToken, authJwt.isAdmin], commentCtrl.getAllRatings)

router.get('/:id',[authJwt.verifyToken], commentCtrl.getRating)

router.post('', [authJwt.verifyToken], commentCtrl.addRating)

router.patch("/:id", [authJwt.verifyToken], commentCtrl.updateRating)

router.delete("/:id", [authJwt.verifyToken], commentCtrl.deleteRating)

module.exports = router