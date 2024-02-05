const bcrypt = require('bcrypt')
const User = require('../models/user')
const UserError = require('../errors/UserError')

exports.getAllUsers = (req, res) => {
    User.findAll()
        .then( users => res.json({data: users}))
        .catch(err => {
            res.status(500).json({ message: "DataBase Error"})
            console.log(err)
        })
}

exports.getUser = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id)
        if(!userId) {
            // return res.json(400).jsonp({ message: "Missing Parameter"})
            throw new UserError("Missing Parameter")
        }

        const user = await User.findOne({ where: {id: userId}, raw: true })
        if((user === null)) {
            // return res.status(404).json({ message: "This user does not exist !"})
            throw new UserError("This user does not exist !")
        }
        return res.json({data: user})

    } catch(err) {
        // res.status(err.statusCode || 500).json({ message: err.message, error: err})
        next(err)
    }
}

exports.addUser = async (req, res) => {
    

    try {
        const {speudo, email, password } = req.body
        if(!speudo || !email || !password) {
            // return res.status(400).json({ message: "Missing Data" })
            throw new UserError("Missing Data")
        }

        const user = await User.findOne({where: { email: email}, raw: true})

        if(user !== null) {
            // return res.status(409).json({ message: `The email ${email} already exists`})
            throw new UserError(`The email ${email} already exists`)
        }

        const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
        req.body.password = hash

        const userCrypted = await User.create(req.body)
        return res.json({message: "UserCreated", data: userCrypted})
        
    }catch(err) {
        // res.status(err.statusCode || 500).json({ message: err.message, error: err})
        next(err)
    }
}

exports.updateUser = async (req, res) => {
    
    try {
        let userId = parseInt(req.params.id)
        if(!userId) {
            // return res.status(400).json({ message: "Missing parameter" })
            throw new Error("Missing parameter" )
        }

        const user = await User.findOne({ where: {id: userId}, raw: true})

        if(user === null) {
            // return res.status(404).json({ message: "This user does not exist !"})
            throw new Error("This user does not exist !")
        }
        
        await User.update(req.body, {where: {id: userId}})
        return res.json({ message: "User Updated", data: user })

    } catch(err) {
        // res.status(err.statusCode || 500).json({ message: err.message, error: err})
        next(err)
    }
}

exports.untrashUser = (req, res) => {
    let userId = parseInt(req.params.id)

    if(!userId) {
        return res.status(400).json({ message: "Missing parameter" })
    }

    User.restore({ where : {id: userId}})
        .then(() => { res.status(204).json({})})
        .catch(err => res.status(500).json({ message: 'DataBase Error', error: err }))
}

exports.trashUser = (req, res) => {
    let userId = parseInt(req.params.id)

    if(!userId) {
        return res.status(400).json({ message: "Missing parameter" })
    }
    
    User.destroy({ where: {id: userId}})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'DataBase Error', error: err }))
}

exports.deleteUser = (req, res) => {
    let userId = parseInt(req.params.id)

    if(!userId) {
        return res.status(400).json({ message: "Missing parameter" })
    }
    
    User.destroy({ where: {id: userId}, force: true})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'DataBase Error', error: err }))
}
