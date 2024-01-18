const jwt = require('jsonwebtoken')

const extractBearer = authorization => {
    if(typeof authirization !== 'string') {
        return false
    }
    const matches = authorization.match(/(bearer)\s+(\S+)/i)

    return matches && matches[2]
}

const checkTokenMiddleware = (req, res, next) => {
    const token= req.headers.authorization && extractBearer(req.headers.authorization)

    if(!token){
        return res.status(401).json({ message: "arhhhhhhhhhhhg"})
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if(err) {
            return res.status(401).json({ message: "Bad token" })
        }

        next()
    })
}
module.exports = checkTokenMiddleware