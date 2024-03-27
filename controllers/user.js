const {UserError, RequestError } = require('../errors/customError')
const DB = require("../db.config")
const User = DB.User
const bcrypt = require('bcrypt')

exports.getAllUsers = (req, res) => {

    User.findAll()
        .then( users => res.json({data: users}))
        .catch(err => { next(err)})
}

exports.getUser = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id)
        if(!userId) {
            throw new RequestError("Missing Parameter")
        }

        const user = await User.findOne({ where: { id: userId }, raw: true, attributes: ["id", "username", "email"] })
        if((user === null)) {
            throw new UserError("This user does not exist !")
        }

        return res.json({data: user})

    } catch(err) {
        next(err)
    }
}

exports.addUser = async ( req, res, next) => {
    try {
        const {username, email, password } = req.body
        if(!username || !email || !password) {
            throw new RequestError("Missing Data")
        }

        let user = await User.findOne({where: { username: username }})
        if(user !== null) {
            throw new UserError(`The user ${ username } already exists`, 1)
        }
        user = await User.findOne({where: { email: email }})
        if(user !== null) {
            throw new UserError(`The user ${ email } already exists`, 1)
        }

        userCrypted = await User.create(req.body)
        return res.json({message: "UserCreated", data: userCrypted})
        
    } catch(err) {
        next(err)
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const user_Id = req.auth.user_Id
        let userId = parseInt(req.params.id)
        if(!userId) {
            throw new RequestError("Missing parameter" )
        }

        const user = await User.findOne({ where: {id: userId}, raw: true})

        if(user === null) {
            throw new UserError("This user does not exist !")
        }
        
        const isAdmin = req.auth.roles.some((role)=> {
            return role === "admin"})
        if (isAdmin || user.id === user_Id ) {
            if(req.body.password) {
                const hash = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUND))
                req.body.password = hash
            }
            await User.update(req.body, { where: { id: userId } })
            return res.json({ message: "User Updated" })
        }
        throw new UserError("You don't have the right for this")

    } catch(err) {
        next(err)
    }
}

exports.untrashUser = async ( req, res, next) => {
    try {
        let userId = parseInt(req.params.id)
        if(!userId) {
            throw new RequestError("Missing parameter")
        }

        await User.restore({ where : {id: userId}})
        return res.status(204).json({})
    } catch(err) {
        next(err)
    }
}

exports.trashUser = async (req, res, next) => {
    try {
        let userId = parseInt(req.params.id)
        if(!userId) {
           throw new RequestError("Missing parameter")
        }

        await User.destroy({ where: {id: userId}})
        return  res.status(204).json({})
        
    } catch(err) {
        next(err)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const user_Id = req.auth.user_Id
        let userId = parseInt(req.params.id)
        if(!userId) {
            throw new RequestError("Missing parameter")
        }
        
        const user = await User.findOne({ where: {id: userId}, raw: true})
        
        const isAdmin = req.auth.roles.some((role)=> { return role === "admin" })
        if (isAdmin || user.id === user_Id ) {
            await User.destroy({ where: {id: userId}, force: true})
            return res.status(204).json({})
        }
        throw new UserError("You don't have the right for this")
        
    } catch(err) { next(err) }
}
