
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


exports.loginUser = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(400).json({ message: "Bad email or password" })
    }

    try {
        const user = await User.findOne({ where: {email: email}, raw: true})
        if (user === null) {
            return res.status(401).json({ message: "This account does not exists !" })
        }

        const test = await bcrypt.compare(password, user.password)
        if(!test) {
            return res.status(401).json({ message: "Wrong password" })
        }

        const token = jwt.sign({
            id: user.id,
            speudo: user.speudo,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING })

       return res.json({access_token: token})
    } catch (err) {
        if (err.name ==='SequelizeDataBaseError') {
            res.status(500).json({ message: "DataBase Error", error: err })
        }
        res.status(500).json({ message: "Login process failed", error: err })
    }
}