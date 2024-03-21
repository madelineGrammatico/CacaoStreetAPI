const DB = require("../db.config")
const Rating = DB.Rating
const Chocolate = DB.Chocolate
const { CommentError, RequestError } = require('../errors/customError')
const chocolateCtrl = require('../controllers/chocolate')
// const { Sequelize, Op } = require('sequelize');


const calculateAverage = async (chocolate_Id) => {
    const ratings = await Rating.findAll({
        include: [{
            model: DB.Chocolate,
            through: {
                model: DB.Chocolate_Rating,
                where: {
                    chocolateId: chocolate_Id
                }
            }
        }]
    })
    
    const totalRating = ratings.reduce((total, rating) => {
        return total + rating.rate;
    }, 0)
    const numberOfRatings = ratings.length
    const averageRating = numberOfRatings > 0 ? totalRating / numberOfRatings : 0;
    console.log(averageRating)
    return averageRating
}
exports.getAllRatings = (req, res) => {
    Rating.findAll()
        .then( ratings => res.json({data: ratings}))
        .catch(err => { next(err)})
}

exports.getRating = async (req, res, next) => {
    try {
        const ratingId = parseInt(req.params.id)
        if(!ratingId) {
            throw new RequestError("Missing Parameter")
        }

        const rating = await Rating.findOne({ 
            where: { id: commentId }, 
            include: [
            { 
                model: DB.Chocolate, 
                as: "Chocolate", 
                attributes: ["id","name", "addressShop", "position", "rate", "price", "hours"]
            },
            {
                model: DB.User, 
                as: "User", 
                attributes: ["id","name", "email"]
            }
         ]
        })
        if((rating === null)) {
            throw new CommentError("This comment does not exist !", 0)
        }

        return res.json({data: rating})

    } catch(err) { next(err) }
}

exports.addRating = async ( req, res, next,) => {
    try {
        const user_Id = req.auth.user_Id
        const chocolate_Id= parseInt(req.body.chocolate_Id)
        const rate = parseInt(req.body.rate)
        const comment_Id = parseInt(req.body.comment_Id)
        
        if( !rate || !user_Id) {
            throw new RequestError("Missing Data")
        }
        const chocolate = await Chocolate.findByPk(chocolate_Id)
        if(chocolate === null) {
            throw new CommentError(`the chocolate of the comment don't exists`)
        }
        
        const ratingWithUser = {
            rate, 
            user_Id: user_Id,
            chocolate_Id, 
            comment_Id: comment_Id
        }
        const rating = await Rating.create(ratingWithUser)
        rating.addChocolate(chocolate)

        const averageRating = await calculateAverage(chocolate_Id)
        req.body = {
            averageRating: averageRating,
            chocolate_Id: chocolate_Id
        }
        chocolateCtrl.updateChocolate(req, res, next)
    } catch(err) { next(err) }
}

exports.updateRating = async (req, res, next) => {
    try {
        const user_Id = req.auth.user_Id
        const ratingId = parseInt(req.params.id)
        if(!ratingId) {
            // return res.json(400).json({ message: "Missing Parameter"})
            throw new RequestError("Missing Data")
        }

        const rating = await Rating.findOne({ where: {id: ratingId}, raw: true})
        if(rating === null) {
            // return res.json(404).json({ message: "comment does'nt exist"})
            throw new CommentError("This comment does not exist !")
        }

        const isAdmin = req.auth.roles.some((role)=> {
            return role === "admin"})
        if (isAdmin || rating.id === user_Id ) {
            await Rating.update(req.body, { where: { id: ratingId } })
        
            const averageRating = await calculateAverage(rating.chocolate_Id)
            req.body = {
                averageRating: averageRating,
                chocolate_Id: rating.chocolate_Id
            }
            next()
        }
        return res.json(409).json({ message: "You don't have the right for this"})

    } catch(err) { next(err) }
}

exports.deleteRating = async (req, res, next) => {
    try {
        const user_Id = req.auth.user_Id
        let ratingId = parseInt(req.params.id)
        if(!ratingId) {
            // return res.json(400).json({ message: "Missing Parameter"})
            throw new RequestError("Missing Data")
        }

        const rating = await Rating.findOne({ where: {id: ratingId}, raw: true})

        const isAdmin = req.auth.roles.some((role)=> {
            return role === "admin"})
        if (isAdmin || rating.id === user_Id ) {
            const chocolate_Id = rating.chocolate_Id
            await Rating.destroy({ where: {id: ratingId}, force: true})
            
            const averageRating = await calculateAverage(chocolate_Id)
            req.body = {
                averageRating: averageRating,
                chocolate_Id: chocolate_Id
            }

            next()
        }
        return res.json(409).json({ message: "You don't have the right for this"})

    } catch(err) { next(err)}
}