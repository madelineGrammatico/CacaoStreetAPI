const express = require('express')

const commentCtrl = require('../controllers/comment')
const checkTokenMiddleware = require('../jsonwebtoken/checkUser')

const router = express.Router()

router.get('/', commentCtrl.getAllComments)

router.get('/:id', commentCtrl.getComment)

router.post('', checkTokenMiddleware, commentCtrl.addComment)

router.patch("/:id", checkTokenMiddleware, commentCtrl.updateComment)

router.delete("/:id", checkTokenMiddleware, commentCtrl.deleteComment)

module.exports = router