
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const DB = require("../db.config")
const User = DB.User
const {UserError, AuthentificationError} = require('../errors/customError')


exports.loginUser = async (req, res, next) => {
    

    try {
        const {email, password} = req.body
        if(!email || !password) {
            // return res.status(400).json({ message: "Bad email or password" })
            throw new AuthentificationError("Bad email or password", 0)
        }

        const user = await User.findOne({ where: {email: email}, raw: true})
        if (user === null) {
            // return res.status(401).json({ message: "This account does not exists !" })
            throw new AuthentificationError("This account does not exists !")
        }

        const test = await bcrypt.compare(password, user.password)
        if(!test) {
            // return res.status(401).json({ message: "Wrong password" })
            throw new AuthentificationError("Wrong password", 1)
        }

        const token = jwt.sign({
            id: user.id,
            speudo: user.speudo,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING })

       return res.json({access_token: token})
    } catch (err) {
        next(err)
        // if (err.name ==='SequelizeDataBaseError') {
        //     res.status(500).json({ message: "DataBase Error", error: err })
        // }
        // res.status(err.statusCode || 500).json({ message: err.message, error: err})
    }
}