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
    foreignKey: "User_Id",
    as:"Chocolate"
})
db.Chocolate.belongsTo(db.User, {
    foreignKey: "User_Id",
    as:"User"
})

db.Chocolate.hasMany(db.Comment, {
    foreignKey: "Chocolate_Id",
    as: "Comment"
})
db.Comment.belongsTo(db.Chocolate, {
    foreignKey: "Chocolate_Id",
    as:"Chocolate"
})

db.User.hasMany(db.Comment,(db.Comment, {
    foreignKey: "User_comment_Id",
    as: "Comment"
}))
db.Comment.belongsTo(db.User,{
    foreignKey: "User_comment_Id",
    as:"User"
})

sequelize.sync((err) => {
    console.log('Database Error', err)
})

module.exports = db