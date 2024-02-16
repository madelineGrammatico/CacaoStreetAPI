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

        const chocolate = await Chocolate.findOne({ where: { id: chocolateId }, raw: true })
        if((chocolate === null)) {
            throw new ChocolateError("This user does not exist !", 0)
        }

        return res.json({data: chocolate})

    } catch(err) { next(err) }
}

exports.addChocolate = async (user_Id, req, res, next) => {
    try {
        const {name, addressShop, position, rate, hours, price } = req.body
        if(!name || !addressShop || !position || !rate || !hours || !price) {
            throw new RequestError("Missing Data")
        }
        
        const isChocolateExist = await Chocolate.findOne({ where: { name: name, addressShop: addressShop }, raw: true })
        if(isChocolateExist !== null) {
            throw new ChocolateError(`The chocolate '${isChocolateExist.name}' already exists`,1)
        }

        let chocolate = {
            name, addressShop, position, rate, hours, price, user_Id
        }
        chocolate = await Chocolate.create(chocolate)
        return res.json({ message: "Chocolate Created", data: chocolate })
        
    } catch(err) { next(err) }
}

exports.updateChocolate = async (user_Id, req, res, next) => {
    try {
        const chocolateId = parseInt(req.params.id)
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

exports.deleteChocolate = async (user_Id, req, res, next) => {
    try {
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
        return res.status(204).json({})

    } catch(err) { next(err) }
}

