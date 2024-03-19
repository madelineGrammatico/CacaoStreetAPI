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
    async(err, decoded) => {
      if (err) {
        return res.status(401).send({
            message: "Unauthorized!",
        })
      }
      req.auth = {
        user_Id: decoded.id,
        roles: []
      }
      console.log("1")
      const user = await User.findByPk(req.auth.user_Id)
      console.log("2")
      const roles = await user.getRoles()     
      console.log("3")  
      await roles.map((role) => {
        console.log("5")
        req.auth.roles.push(role.name)
      })
      console.log("6")
      next()
    })
}

isAdmin = (req, res, next) => {
  User.findByPk(req.auth.user_Id).then(user => {
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