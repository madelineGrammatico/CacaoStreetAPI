const express = require('express')
const { authJwt } = require("../middleware");
const commentCtrl = require('../controllers/comment')
const ratingCtrl = require('../controllers/rating')
const chocolateCtrl = require('../controllers/chocolate')

const router = express.Router()

router.get('/', commentCtrl.getAllComments)

router.get('/:id', commentCtrl.getComment)

router.post('', [authJwt.verifyToken], commentCtrl.addComment)

router.patch("/:id", [authJwt.verifyToken], commentCtrl.updateComment)

router.delete("/:id", [authJwt.verifyToken], commentCtrl.deleteComment)

module.exports = router