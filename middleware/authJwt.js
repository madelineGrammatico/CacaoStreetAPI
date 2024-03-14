const jwt = require("jsonwebtoken")
const db = require("../db.config")
const User = db.User

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"]
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    })
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
            message: "Unauthorized!",
        })
      }
      req.auth = {
        user_Id: decoded.id,
        roles: decoded.roles
      }
      next()
    }
  )
}

isAdmin = (req, res, next) => {
  User.findByPk(req.user_Id).then(user => {
    console.log(user)
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next()
          return
        }
      }
      res.status(403).send({
        message: "Require Admin Role!"
      })
      return
    })
  })
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
}
module.exports = authJwt;