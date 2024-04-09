const { authJwt } = require("../middleware")
const userCtrl = require('../controllers/user')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

  app.get(
    '/api/admin/users',
    [authJwt.verifyToken, authJwt.isAdmin],
    userCtrl.getAllUsers
  )

  app.get(
    '/api/admin/users/:id',
    [authJwt.verifyToken, authJwt.isAdmin],
    userCtrl.getUser
  )

  app.patch(
    "/api/users/:id",
    [authJwt.verifyToken],
    userCtrl.updateUser
  )
  app.patch(
    "/api/users/:id/newpassword",
    [authJwt.verifyToken],
    userCtrl.updateUserPassword
  )

  app.patch(
    "/api/users/:id/newemail",
    [authJwt.verifyToken],
    userCtrl.updateUserEmail
  )
    
  app.patch(
    "/api/users/untrash/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    userCtrl.untrashUser
  )

  app.delete(
    "/api/users/trash/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    userCtrl.trashUser
  )

  app.delete(
    "/api/users/:id",
    [authJwt.verifyToken],
    userCtrl.deleteUser
  )

}