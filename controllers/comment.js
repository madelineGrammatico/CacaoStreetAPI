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

        const comment = await Comment.findOne({ where: { id: commentId }, raw: true })
        if((comment === null)) {
            throw new CommentError("This comment does not exist !", 0)
        }

        return res.json({data: comment})

    } catch(err) { next(err) }
}

exports.addComment = async (req, res, next) => {
    
    try {
        const {body, rate} = req.body
        if(!body || !rate) {
            throw new RequestError("Missing Data")
        }
        
        const comment = await Comment.create(req.body)
        return res.json({ message: "Comment Created", data: comment })
        
    } catch(err) { next(err) }
}

exports.updateComment = async (req, res, next) => {
    try {
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

        await Comment.update(req.body, { where: { id: commentId } })
        return res.json({ message: "Comment Updated" })

    } catch(err) { next(err) }
}

exports.deleteComment = async (req, res, next) => {
    try {
        let commentId = parseInt(req.params.id)
        if(!commentId) {
            // return res.json(400).json({ message: "Missing Parameter"})
            throw new RequestError("Missing Data")
        }
        
        await Comment.destroy({ where: {id: commentId}, force: true})
        return res.status(204).json({})

    } catch(err) { next(err) }
}

