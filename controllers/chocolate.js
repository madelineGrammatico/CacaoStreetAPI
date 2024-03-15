const DB = require("../db.config")
const Chocolate = DB.Chocolate
const { ChocolateError, RequestError } = require('../errors/customError')

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
            include: { model: DB.User, as: "User", attributes: ["id", "pseudo", "email"]}
        })
        if((chocolate === null)) {
            throw new ChocolateError("This user does not exist !", 0)
        }
        // const user = await DB.User.findOne({ where: {id: user_Id}, raw: true})
        return res.json({data: chocolate})

    } catch(err) { next(err) }
}

exports.addChocolate = async ( req, res, next) => {
    console.log("auth : ",req.auth)
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
        }
        chocolate = await Chocolate.create(chocolate)
        return res.json({ message: "Chocolate Created", data: chocolate })
        
    } catch(err) { next(err) }
}

exports.updateChocolate = async ( req, res, next) => {
    console.log("dans la modif du chocolat")
    console.log("req chocolate : ", req.body)
    try {
        const user_Id = req.auth.user_Id
        const chocolateId = parseInt(req.params.id) || req.body.chocolate_Id
        if(!chocolateId) {
            return res.json(400).json({ message: "Missing Parameter"})
        }

        const chocolate = await Chocolate.findOne({ where: {id: chocolateId}, raw: true})
        if(chocolate === null) {
            return res.json(404).json({ message: "chocolate does'nt exist"})
        }
        if (chocolate.user_Id !== user_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }
        
        await Chocolate.update(req.body, { where: { id: chocolateId } })
        return res.json({ message: "Chocolate Updated" })

    } catch(err) { next(err) }
}

exports.deleteChocolate = async ( req, res, next) => {
    try {
        const user_Id = req.auth.user_Id
        let chocolateId = parseInt(req.params.id)
        if(!chocolateId) {
            return res.json(400).json({ message: "Missing Parameter"})
        }

        const chocolate = await Chocolate.findOne({ where: {id: chocolateId}, raw: true})
        if(chocolate === null) {
            return res.json(404).json({ message: "chocolate does'nt exist"})
        }
        if (chocolate.user_Id !== user_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }

        await Chocolate.destroy({ where: {id: chocolateId}, force: true})
        return res.status(204).json({ message: "chocolate delete"})

    } catch(err) { next(err) }
}

