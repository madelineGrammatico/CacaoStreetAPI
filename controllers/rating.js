const DB = require("../db.config")
const Rating = DB.Rating
const Chocolate = DB.Chocolate
const { CommentError, RequestError } = require('../errors/customError')


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
                attributes: ["id","pseudo", "email"]
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
        // const chocolate_Id = parseInt(req.body.chocolate_Id)
        if( !rate || !user_Id) {
            throw new RequestError("Missing Data")
        }

        // const chocolate = await Chocolate.findOne({ where: { id: chocolate_Id }, raw: true })
        const chocolate = await Chocolate.findByPk(chocolate_Id)
        if(chocolate === null) {
            throw new CommentError(`the chocolate of the comment don't exists`)
        }
        
        const ratingWithUser = {
            rate, 
            user_Id: user_Id,
            chocolate_Id
        }
        const rating = await Rating.create(ratingWithUser)
        rating.addChocolate(chocolate)

        const ratingsAssociation = await DB.Chocolate_Rating.findAll({
            where: {
            chocolateId: chocolate_Id
            }
        })
        console.log(ratingsAssociation)





        return res.json({ message: "Comment Created", data: rating })
        
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

        if (rating.user_Id !== user_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }

        await Rating.update(req.body, { where: { id: ratingId } })
        return res.json({ message: "Rating Updated" })

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
        if (rating.user_Id !== user_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }

        await Rating.destroy({ where: {id: ratingId}, force: true})
        return res.status(204).json({})

    } catch(err) { next(err)}
}