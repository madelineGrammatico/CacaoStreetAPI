const express = require('express')
const { authJwt } = require("../middleware");
const ratingCtrl = require('../controllers/rating')

const router = express.Router()

router.get('/', [authJwt.verifyToken, authJwt.isAdmin], ratingCtrl.getAllRatings)

router.get('/:id',[authJwt.verifyToken], ratingCtrl.getRating)

router.post('', [authJwt.verifyToken], ratingCtrl.addRating)

router.patch("/:id", [authJwt.verifyToken], ratingCtrl.updateRating)

router.delete("/:id", [authJwt.verifyToken], ratingCtrl.deleteRating)

module.exports = router