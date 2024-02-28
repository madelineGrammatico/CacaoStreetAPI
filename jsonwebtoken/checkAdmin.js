const jwt = require('jsonwebtoken')

const extractBearer = authorization => {
    if(typeof authorization !== 'string') {
        return false
    }
    const matches = authorization.match(/(bearer)\s+(\S+)/i)

    return matches && matches[2]
}

const checkAdminMiddleware = (req, res, next) => {
    const token= req.headers.authorization && extractBearer(req.headers.authorization)
    if(!token){
        return res.status(401).json({ message: "arhhhhhhhhhhhg where are your token ?!?!!"})
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if(err) {
            return res.status(401).json({ message: "Bad token" })
        }
        req.auth = { admin_Id: decodedToken.id }
        next()
    })
}
module.exports = checkAdminMiddleware