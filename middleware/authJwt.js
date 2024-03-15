const jwt = require("jsonwebtoken")
const db = require("../db.config")
const User = db.User

verifyToken = async(req, res, next) => {
  let token = req.headers["x-access-token"]
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    })
  }

  await jwt.verify(
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

      const user = await User.findByPk(req.auth.user_Id)
        await user.getRoles().then(roles => {
          for (let i = 0; i < roles.length; i++) {
            console.log("role :", roles[i].name)
            req.auth.roles.push(roles[i].name)
          }
        })
      
      console.log("tableau :", req.auth.roles)
      
    }
  )

  
}

isAdmin = (req, res, next) => {
  User.findByPk(req.auth.user_Id).then(user => {
    console.log(user)
    user.getRoles().then(roles => {
      console.log("roles : ", roles )
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