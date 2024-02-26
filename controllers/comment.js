const DB = require("../db.config")
const Comment = DB.Comment
const { CommentError, RequestError } = require('../errors/customError')

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
                attributes: ["id","pseudo", "email"]
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
    
    try {
        const user_Id = req.auth.user_Id
        const {body, rate, chocolate_Id} = req.body
        if(!body || !rate || !chocolate_Id || !user_Id) {
            throw new RequestError("Missing Data")
        }

        const chocolate = await DB.Chocolate.findOne({ where: { id: chocolate_Id }, raw: true })
        if(chocolate === null) {
            throw new CommentError(`the chocolate of the comment don't exists`)
        }
        
        const commentWithUser = {
            body, rate, chocolate_Id, 
            user_comment_Id: user_Id
        }
        const comment = await Comment.create(commentWithUser)
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

        if (comment.user_comment_Id !== user_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }

        await Comment.update(req.body, { where: { id: commentId } })
        return res.json({ message: "Comment Updated" })

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

        const comment = await Comment.findOne({ where: {id: commentId}, raw: true})
        if (comment.user_comment_Id !== user_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }

        await Comment.destroy({ where: {id: commentId}, force: true})
        return res.status(204).json({})

    } catch(err) { next(err) }
}

