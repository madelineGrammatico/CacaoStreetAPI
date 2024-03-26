const DB = require("../db.config")
const Reporting = DB.Reporting
const { ReportingError, RequestError, UserError } = require('../errors/customError')

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
                attributes: ["id", "name", "addressShop", "position", "price", "hours"]
            },
            {
                model: DB.User, 
                as: "User", 
                attributes: ["id", "username", "email"]
            }
         ]
        })
        if((reporting === null)) {
            throw new ReportingError("This reporting does not exist !")
        }

        return res.json({data: reporting})

    } catch(err) { next(err) }
}

exports.addReporting = async ( req, res, next,) => {
    
    try {
        const user_Id = req.auth.user_Id
        const body = req.body.body
        const chocolate_Id = parseInt(req.body.chocolate_Id)
        if(!body || !chocolate_Id || !user_Id) {
            throw new RequestError("Missing Data")
        }
        
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
        const user_Id = req.auth.user_Id
        const reportingId = parseInt(req.params.id)
        if(!reportingId) {
            throw new RequestError("Missing Data")
        }

        const reporting = await Reporting.findOne({ where: {id: reportingId}, raw: true})
        if(reporting === null) {
            throw new ReportingError("This reporting does not exist !")
        }

        if (reporting.user_Id !== user_Id || !req.auth.roles.some((role)=> {return role === "admin"})) {
            
        }
        const isAdmin = req.auth.roles.some((role)=> {
            return role === "admin"})
        if (isAdmin || reporting.id === user_Id ) {
            await Reporting.update(req.body, { where: { id: reportingId } })
            return res.json({ message: "Reporting Updated" })    
        }
        throw new UserError("You don't have the right for this")
        
    } catch(err) { next(err) }
}

exports.deleteReporting = async (req, res, next) => {
    try {
        const user_Id = req.auth.user_Id
        const reportingId = parseInt(req.params.id)
        if(!reportingId) {
            throw new RequestError("Missing Data")
        }

        const reporting = await Reporting.findOne({ where: {id: reportingId}, raw: true})
      
        const isAdmin = req.auth.roles.some((role)=> {
            return role === "admin"})
        if (isAdmin || reporting.id === user_Id ) {
            await Reporting.destroy({ where: {id: reportingId}, force: true})
            return res.status(204).json({})
        }
        throw new UserError("You don't have the right for this")

    } catch(err) { next(err) }
}

