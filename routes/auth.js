const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

let router = express.Router()
router.post('/login', (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(400).json({message: "Bad email or password"})
    }

    User.findOne({ where: {email: email}, raw: true})
        .then(user => {
            if (user === null) {
                return res.status(401).json({message: "This account does not exists !"})
            }
            bcrypt.compare(password, user.password)
                .then(test => {
                    if(!test) {
                        return res.status(401).json({message: "Wrong password"})
                    }

                    const token = jwt.sign({
                         id: user.id,
                         speudo: user.speudo,
                         email: user.email
                    }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_DURING})

                    return res.json({access_token: token})
                })
                .catch( err => res.status(500).json({message: "Login process failed, error: err"}))
        })
})
module.exports = router