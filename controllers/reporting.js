const DB = require("../db.config")
const Reporting = DB.Reporting
const { CommentError, RequestError } = require('../errors/customError')

exports.getAllReportings = (req, res) => {
    Reporting.findAll()
        .then( reportings => res.json({data: reportings}))
        .catch(err => { next(err)})
}

exports.getReporting = async (req, res, next) => {
    try {
        const reportingId = parseInt(req.params.id)
        if(!reportingId) {
            throw new RequestError("Missing Parameter")
        }

        const reporting = await Reporting.findOne({ 
            where: { id: reportingId }, 
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
        if((reporting === null)) {
            throw new CommentError("This comment does not exist !", 0)
        }

        return res.json({data: reporting})

    } catch(err) { next(err) }
}

exports.addReporting = async ( req, res, next,) => {
    
    try {
        const user_Id = req.user_Id
        const body = req.body.body
        const chocolate_Id = parseInt(req.body.chocolate_Id)
        if(!body || !chocolate_Id || !user_Id) {
            throw new RequestError("Missing Data")
        }

        // const chocolate = await DB.Chocolate.findOne({ where: { id: chocolate_Id }, raw: true })
        // if(chocolate === null) {
        //     throw new CommentError(`the chocolate of the comment don't exists`)
        // }
        
        const reportingWithUser = {
            body, chocolate_Id, 
            user_Id, isClose: false
        }
        const reporting = await Reporting.create(reportingWithUser)
        return res.json({ message: "Reporting Created", data: reporting })
        
    } catch(err) { next(err) }
}

exports.updateReporting = async (req, res, next) => {
    try {
        const user_Id = req.user_Id
        const reportingId = parseInt(req.params.id)
        if(!reportingId) {
            // return res.json(400).json({ message: "Missing Parameter"})
            throw new RequestError("Missing Data")
        }

        const reporting = await Reporting.findOne({ where: {id: reportingId}, raw: true})
        if(reporting === null) {
            // return res.json(404).json({ message: "comment does'nt exist"})
            throw new CommentError("This reporting does not exist !")
        }

        if (reporting.user_Id !== user_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }

        await Reporting.update(req.body, { where: { id: reportingId } })
        return res.json({ message: "Reporting Updated" })

    } catch(err) { next(err) }
}

exports.deleteReporting = async (req, res, next) => {
    try {
        const user_Id = req.user_Id
        let reportingId = parseInt(req.params.id)
        if(!reportingId) {
            // return res.json(400).json({ message: "Missing Parameter"})
            throw new RequestError("Missing Data")
        }

        const reporting = await Reporting.findOne({ where: {id: reportingId}, raw: true})
        if (reporting.user_Id !== user_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }

        await Reporting.destroy({ where: {id: reportingId}, force: true})
        return res.status(204).json({})

    } catch(err) { next(err) }
}

