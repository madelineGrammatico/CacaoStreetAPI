const bcrypt = require('bcrypt')
const User = require('../models/user')


exports.getAllUsers = (req, res) => {
    User.findAll()
        .then( users => res.json({data: users}))
        .catch(err => {
            res.status(500).json({ message: "DataBase Error"})
            console.log(err)
        })
}

exports.getUser = (req, res) => {
    let userId = parseInt(req.params.id)
    if(!userId) {
        return res.json(400).jsonp({ message: "Missing Parameter"})
    }

    User.findOne({ where: {id: userId}, raw : true})
        .then(user => {
            if((user === null)) {
                return res.status(404).json({ message: "This user does not exist !"})
            }
            return res.json({data: user})
        })
        .catch(err => res.status(500).json({ message: 'DataBase Error', error: err}))
}

exports.addUser = (req, res) => {
    const {speudo, email, password } = req.body

    if(!speudo || !email || !password) {
        return res.status(400).json({ message: "Missing Data" })
    }

    User.findOne({where: { email: email}, raw: true})
        .then(user => {
            if(user !== null) {
                return res.status(409).json({ message: `The email ${email} already exists`})
            }

            bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
                .then(hash => {
                    req.body.password = hash

                    User.create(req.body)
                    .then(user => res.json({message: "UserCreated", data: user}))
                    .catch(err => res.status(500).json({ message: 'DataBase Error', error: err }))
                })
                .catch(err => res.status(500))

        })
        .catch(err => res.status(500).json({ message: 'DataBase Error', error: err }))
}

exports.updateUser = (req, res) => {
    let userId = parseInt(req.params.id)

    if(!userId) {
        return res.status(400).json({ message: "Missing parameter" })
    }

    User.findOne({ where: {id: userId}, raw: true})
        .then(user => {
            if(user === null) {
                return res.status(404).json({ message: "This user does not exist !"})
            }

            User.update(req.body, {where: {id: userId}})
                .then( user => res.json({ message: "User Updated", data: user }))
                .catch(err => res.status(500).json({ message: 'DataBase Error', error: err }))
        })
        .catch(err => res.status(500).json({ message: 'DataBase Error', error: err }))
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