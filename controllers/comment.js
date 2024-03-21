const DB = require("../db.config")
const Comment = DB.Comment
const { CommentError, RequestError } = require('../errors/customError')
const ratingCtrl = require('../controllers/rating')

exports.getAllComments = (req, res) => {
    Comment.findAll()
        .then( comments => res.json({data: comments}))
        .catch(err => { next(err)})
}

exports.getComment = async (req, res, next) => {
    try {
        const commentId = parseInt(req.params.id)
        if(!commentId) {
            throw new RequestError("Missing Parameter")
        }

        const comment = await Comment.findOne({ 
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
        if((comment === null)) {
            throw new CommentError("This comment does not exist !", 0)
        }

        return res.json({data: comment})

    } catch(err) { next(err) }
}

exports.addComment = async ( req, res, next,) => {
    console.log("dans le controller pour ajouter un commentaire")
    try {
        const user_Id = req.auth.user_Id
        const {body} = req.body
        const chocolate_Id = parseInt(req.body.chocolate_Id)
        if(!body || !chocolate_Id || !user_Id) {
            throw new RequestError("Missing Data")
        }

        const chocolate = await DB.Chocolate.findOne({ where: { id: chocolate_Id }, raw: true })
        if(chocolate === null) {
            throw new CommentError(`the chocolate of the comment don't exists`)
        }
        
        const commentWithUser = {
            body, chocolate_Id, 
            user_comment_Id: user_Id
        }
        const comment = await Comment.create(commentWithUser)
        if(req.body.rate) {
            console.log("note trouvé ")
            const rate = req.body.rate
            req.body = {
                rate: rate,
                chocolate_Id: chocolate_Id, 
                comment_Id: comment.id
            }
            // next(req, res, next)
            ratingCtrl.addRating(req, res, next)
        } 
            return res.json({ message: "Comment Created", data: comment })
        
        
    } catch(err) { next(err) }
}

exports.updateComment = async (req, res, next) => {
    try {
        const user_Id = req.auth.user_Id
        const commentId = parseInt(req.params.id)
        if(!commentId) {
            // return res.json(400).json({ message: "Missing Parameter"})
            throw new RequestError("Missing Data")
        }

        const comment = await Comment.findOne({ where: {id: commentId}, raw: true})
        if(comment === null) {
            // return res.json(404).json({ message: "comment does'nt exist"})
            throw new CommentError("This comment does not exist !")
        }

        const isAdmin = req.auth.roles.some((role)=> {
            return role === "admin"})
        if (isAdmin || comment.id === user_Id ) {
            await Comment.update(req.body, { where: { id: commentId } })
            if(req.body.rate) {
                const rating = DB.Rating.findOne({where: {comment_Id: commentId}})
                if(rating) {
                    ratingCtrl.updateRating(req, res, next)
                } else {
                    ratingCtrl.addRating(req, res, next)
                }
            }
            return res.json({ message: "Comment Updated" })
        }
        return res.json(404).json({ message: "You don't have the right for this"})

    } catch(err) { next(err) }
}

exports.deleteComment = async (req, res, next) => {
    try {
        const user_Id = req.auth.user_Id
        let commentId = parseInt(req.params.id)
        if(!commentId) {
            // return res.json(400).json({ message: "Missing Parameter"})
            throw new RequestError("Missing Data")
        }
        
        const comment = await Comment.findOne({ where: {id: commentId}})
        const isAdmin = req.auth.roles.some((role)=> {
            return role === "admin"})
        if (isAdmin || comment.id === user_Id  === user_Id ) {
            await Comment.destroy({ where: {id: commentId}, force: true})
            return res.status(204).json({})
        }
        return res.json(404).json({ message: "You don't have the right for this"})

    } catch(err) { next(err) }
}

