const bcrypt = require('bcrypt')
const {UserError, RequestError } = require('../errors/customError')
const DB = require("../db.config")
const User = DB.User

exports.getAllUsers = (req, res) => {
    User.findAll()
        .then( users => res.json({data: users}))
        .catch(err => { next(err)})
}

exports.getUser = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id)
        if(!userId) {
            // return res.json(400).json({ message: "Missing Parameter"})
            throw new RequestError("Missing Parameter")
        }

        const user = await User.findOne({ where: { id: userId }, raw: true })
        if((user === null)) {
            // return res.status(404).json({ message: "This user does not exist !"})
            throw new UserError("This user does not exist !", 0)
        }

        return res.json({data: user})

    } catch(err) {
        // res.status(err.statusCode || 500).json({ message: err.message, error: err})
        next(err)
    }
}

exports.addUser = async ( req, res, next) => {
    try {
        const {speudo, email, password } = req.body
        if(!speudo || !email || !password) {
            // return res.status(400).json({ message: "Missing Data" })
            throw new RequestError("Missing Data")
        }

        const user = await User.findOne({where: { email: email}, raw: true})

        if(user !== null) {
            // return res.status(409).json({ message: `The email ${email} already exists`})
            throw new UserError(`The email ${email} already exists`,1)
        }

        const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
        req.body.password = hash

        userCrypted = await User.create(req.body)
        return res.json({message: "UserCreated", data: userCrypted})
        
    } catch(err) {
        // res.status(err.statusCode || 500).json({ message: err.message, error: err})
        next(err)
    }
}

exports.updateUser = async (user_Id, req, res, next) => {
    try {
        let userId = parseInt(req.params.id)
        if(!userId) {
            // return res.status(400).json({ message: "Missing parameter" })
            throw new RequestError("Missing parameter" )
        }

        const user = await User.findOne({ where: {id: userId}, raw: true})

        if(user === null) {
            // return res.status(404).json({ message: "This user does not exist !"})
            throw new UserError("This user does not exist !",0)
        }

        if (user.id !== user_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }

        await User.update(req.body, { where: { id: userId } })
        return res.json({ message: "User Updated" })

    } catch(err) {
        // res.status(err.statusCode || 500).json({ message: err.message, error: err})
        next(err)
    }
}

exports.untrashUser = async (user_Id, req, res, next) => {
    try {
        let userId = parseInt(req.params.id)
        if(!userId) {
            throw new RequestError("Missing parameter")
        }
        
        const user = await User.findOne({ where: {id: userId}, raw: true})
        if (user.id !== user_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }

        await User.restore({ where : {id: userId}})
        return res.status(204).json({})
    } catch(err) {
        next(err)
    }
}

exports.trashUser = async (user_Id, req, res, next) => {
    try {
        let userId = parseInt(req.params.id)
        if(!userId) {
           throw new RequestError("Missing parameter")
        }

        const user = await User.findOne({ where: {id: userId}, raw: true})
        if (user.id !== user_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }
        
        await User.destroy({ where: {id: userId}})
        return  res.status(204).json({})
    } catch(err) {
        next(err)
    }
}

exports.deleteUser = async (user_Id, req, res, next) => {
    try {
        let userId = parseInt(req.params.id)
        if(!userId) {
            throw new RequestError("Missing parameter")
        }
        
        const user = await User.findOne({ where: {id: userId}, raw: true})
        if (user.id !== user_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }

        await User.destroy({ where: {id: userId}, force: true})
        return res.status(204).json({})

    } catch(err) { next(err) }
}
