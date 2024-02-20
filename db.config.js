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

db.sequelize = sequelize
db.User = require("./models/user") (sequelize)
db.Chocolate =require("./models/chocolate") (sequelize)
db.Comment = require("./models/comment") (sequelize)

db.User.hasMany(db.Chocolate, {
    foreignKey: "user_Id",
    as:"Chocolate"
})
db.Chocolate.belongsTo(db.User, {
    foreignKey: "user_Id",
    as:"User"
})

db.Chocolate.hasMany(db.Comment, {
    foreignKey: "chocolate_Id",
    as: "Comment"
})
db.Comment.belongsTo(db.Chocolate, {
    foreignKey: "chocolate_Id",
    as:"Chocolate"
})

db.User.hasMany(db.Comment, {
    foreignKey: "user_comment_Id",
    as: "Comment"
})

db.Comment.belongsTo(db.User,{
    foreignKey: "user_comment_Id",
    as:"User"
})

db.sequelize.sync({alter: true})

module.exports = db