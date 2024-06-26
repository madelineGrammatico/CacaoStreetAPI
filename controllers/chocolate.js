const { where } = require("sequelize")
const DB = require("../db.config")
const Chocolate = DB.Chocolate
const { ChocolateError, RequestError, UserError } = require('../errors/customError')

exports.getAllChocolates = (req, res) => {
    Chocolate.findAll()
        .then( chocolates => res.json({data: chocolates}))
        .catch(err => { next(err)})
}

exports.getChocolate = async (req, res, next) => {
    try {
        const chocolateId = parseInt(req.params.id)
        if(!chocolateId) {
            throw new RequestError("Missing Parameter")
        }

        const chocolate = await Chocolate.findOne({ 
            where: { id: chocolateId },
            include: { model: DB.User, as: "User", attributes: ["id", "username", "email"]}
        })
        if((chocolate === null)) {
            throw new ChocolateError("This chocolate does not exist !")
        }
        // const user = await DB.User.findOne({ where: {id: user_Id}, raw: true})
        return res.json({data: chocolate})

    } catch(err) { next(err) }
}
exports.getChocolateComment = async (req, res, next) => {
    try {
        const chocolateId = parseInt(req.params.id)
        if(!chocolateId) {
            throw new RequestError("Missing Parameter")
        }

        const chocolate = await Chocolate.findOne({ 
            where: { id: chocolateId },
            include: [
                { 
                    model: DB.Comment,
                    as: "Comment",
                    where: {
                        chocolateId: chocolateId
                    }
                },
                { 
                    model: DB.Rating,
                    through: {
                        model: DB.Chocolate_Rating,
                        where: {
                            chocolateId: chocolateId
                        }
                    }
                }
            ]
        })
        if((chocolate === null)) {
            throw new ChocolateError("This chocolate does not exist !")
        }
        // const user = await DB.User.findOne({ where: {id: user_Id}, raw: true})
        return res.json({data: chocolate})

    } catch(err) { next(err) }
}


exports.addChocolate = async ( req, res, next) => {
    try {
        const user_Id = req.auth.user_Id
        const {name, addressShop, position, hours, price } = req.body
        if(!name || !addressShop || !position || !hours || !price || !user_Id) {
            throw new RequestError("Missing Data")
        }
        
        const isChocolateExist = await Chocolate.findOne({ where: { name: name, addressShop: addressShop }, raw: true})
        if(isChocolateExist !== null) {
            throw new ChocolateError(`The chocolate '${isChocolateExist.name}' already exists`,1)
        }
        
        let chocolate = {
            name, addressShop, position, hours, price, user_Id,
            allowed: false
        }
        chocolate = await Chocolate.create(chocolate)
        return res.json({ message: "Chocolate Created", data: chocolate })
        
    } catch(err) { next(err) }
}

exports.updateChocolate = async ( req, res, next) => {
    try {
        const user_Id = req.auth.user_Id
        const chocolateId = parseInt(req.params.id) || req.body.chocolate_Id
        if(!chocolateId) {
            throw new RequestError("Missing Parameter")
        }

        const chocolate = await Chocolate.findOne({ where: {id: chocolateId}, raw: true})
        if(chocolate === null) {
            throw new ChocolateError("chocolate does'nt exist")
        }
        const isAdmin = req.auth.roles.some((role)=> {
            return role === "admin"})
        if (isAdmin || chocolate.user_Id === user_Id ) {
            const updateChocolate = {...req.body}
            
            !isAdmin ? updateChocolate.allowed = false : null
            await Chocolate.update(req.body, { where: { id: chocolateId } })
            return res.json({ message: "Chocolate Updated" })
        }
        throw new UserError("You don't have the right for this")
        
    } catch(err) { next(err) }
}

exports.allowedChocolate = async (req, res, next) => {
    try {
        const chocolateId = req.body.chocolate_Id
        if(!chocolateId) {
            throw new RequestError("Missing Parameter")
        }
        const chocolate = await Chocolate.findOne({ where: {id: chocolateId}, raw: true})
        if(chocolate === null) {
            throw new ChocolateError("chocolate does'nt exist")
        }

        req.body.allowed = true
        await Chocolate.update(req.body, { where: { id: chocolateId } })
        return res.json({ message: "Chocolate Updated" })

    } catch(err) { next(err) }
}

exports.unAllowedChocolate = async (req, res, next) => {
    try {
        const chocolateId = req.body.chocolate_Id
        if(!chocolateId) {
            throw new RequestError("Missing Parameter")
        }

        const chocolate = await Chocolate.findOne({ where: {id: chocolateId}, raw: true})
        if(chocolate === null) {
            throw new ChocolateError("chocolate does'nt exist")
        }
       
        req.body.allowed = false
        await Chocolate.update(req.body, { where: { id: chocolateId } })
        return res.json({ message: "Chocolate Updated" })

    } catch(err) { next(err) }
}

exports.deleteChocolate = async ( req, res, next) => {
    try {
        const user_Id = req.auth.user_Id
        let chocolateId = parseInt(req.params.id)
        if(!chocolateId) {
            throw new RequestError("Missing Parameter")
        }

        const chocolate = await Chocolate.findOne({ where: {id: chocolateId}, raw: true})
        if(chocolate === null) {
            throw new ChocolateError("chocolate does'nt exist")
        }
        const isAdmin = req.auth.roles.some((role)=> {
            return role === "admin"})
        if (isAdmin || chocolate.user_Id === user_Id ) {
            await Chocolate.destroy({ where: {id: chocolateId}, force: true})
            return res.status(204).json({ message: "chocolate delete"})
        }
        throw new UserError("You don't have the right for this")

    } catch(err) { next(err) }
}

