const { Sequelize} = require('sequelize')

let sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host : process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.User = require("./models/user.js")(sequelize, Sequelize)
db.role = require("./models/role.js")(sequelize, Sequelize)
db.ROLES = ["user", "admin"];


db.sequelize = sequelize
// db.User = require("./models/user") (sequelize)
db.Chocolate =require("./models/chocolate") (sequelize)
db.Comment = require("./models/comment") (sequelize)
db.Reporting = require("./models/reporting") (sequelize)

// db.User.hasMany(db.Chocolate, {
//     foreignKey: "user_Id",
//     as:"Chocolate"
// })
// db.Chocolate.belongsTo(db.User, {
//     foreignKey: "user_Id",
//     as:"User"
// })

// db.Chocolate.hasMany(db.Comment, {
//     foreignKey: "chocolate_Id",
//     as: "Comment",
//     onDelelte: "cascade"
// })
// db.Comment.belongsTo(db.Chocolate, {
//     foreignKey: "chocolate_Id",
//     as:"Chocolate"
// })

// db.User.hasMany(db.Comment, {
//     foreignKey: "user_comment_Id",
//     as: "Comment"
// })

// db.Comment.belongsTo(db.User,{
//     foreignKey: "user_comment_Id",
//     as:"User"
// })

db.role.belongsToMany(db.User, {
    through: "user_roles"
  });
  db.User.belongsToMany(db.role, {
    through: "user_roles"
  });
//delete for production
function initial() {
    db.role.create({
        id: 1,
        name: "user"
    })
     
    db.role.create({
        id: 2,
        name: "admin"
    })
}
db.sequelize.sync({force: true}).then(() => {
    console.log("Drop and Resync Database")
    initial()
})

// uncomment for production
// db.sequelize.sync({alter: true})

module.exports = db