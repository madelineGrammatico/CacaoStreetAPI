const express = require('express')
const { authJwt } = require("../middleware");
const ratingCtrl = require('../controllers/rating')
const chocolateCtrl = require('../controllers/chocolate')

const router = express.Router()

router.get('/', [authJwt.verifyToken, authJwt.isAdmin], ratingCtrl.getAllRatings)

router.get('/:id',[authJwt.verifyToken], ratingCtrl.getRating)

router.post('', [authJwt.verifyToken], ratingCtrl.addRating, chocolateCtrl.updateChocolate)

router.patch("/:id", [authJwt.verifyToken], ratingCtrl.updateRating, chocolateCtrl.updateChocolate)

router.delete("/:id", [authJwt.verifyToken], ratingCtrl.deleteRating, chocolateCtrl.updateChocolate)

module.exports = router