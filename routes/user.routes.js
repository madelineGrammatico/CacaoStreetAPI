const { authJwt } = require("../middleware")
// const controller = require("../controllers/user.controller");
const userCtrl = require('../controllers/user')

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

  // app.get("/api/all", controller.allAccess)

  // app.get(
  //   "/api/user",
  //   [authJwt.verifyToken],
  //   controller.userBoard
  // )

  // app.get(
  //   "/api/admin",
  //   [authJwt.verifyToken, authJwt.isAdmin],
  //   controller.adminBoard
  // )

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

  // router.post(
  //  '', 
  //  userCtrl.addUser
  // )

  app.patch(
    "/api/users/:id",
    [authJwt.verifyToken],
    userCtrl.updateUser
  )
    
  app.patch(
    "/api/users/untrash/:id",
    [authJwt.verifyToken],
    userCtrl.untrashUser
  )

  app.delete(
    "/api/users/trash/:id",
    [authJwt.verifyToken],
    userCtrl.trashUser
  )

  app.delete(
    "/api/users/:id",
    [authJwt.verifyToken],
    userCtrl.deleteUser
  )

}