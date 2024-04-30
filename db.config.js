const { Sequelize} = require('sequelize')
// const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

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

db.Chocolate =require("./models/chocolate") (sequelize)
db.Comment = require("./models/comment") (sequelize)
db.Reporting = require("./models/reporting") (sequelize)
db.Rating = require("./models/rating") (sequelize)
db.Chocolate_Rating = sequelize.define("Chocolate_Rating", {}, { timestamps: false });
db.Chocolate.belongsToMany(db.Rating, { 
        through: db.Chocolate_Rating
    })
db.Rating.belongsToMany(db.Chocolate, {
         through: db.Chocolate_Rating
    })


db.role.belongsToMany(db.User, {
    through: "user_roles"
  });
db.User.belongsToMany(db.role, {
    through: "user_roles"
})

db.User.hasMany(db.Chocolate, {
    foreignKey: "user_Id",
    as:"Chocolate"
})
db.Chocolate.belongsTo(db.User, {
    foreignKey: "user_Id",
    as:"User"
})

db.User.hasMany(db.Comment, {
    foreignKey: "user_comment_Id",
    as: "Comment"
})
db.Comment.belongsTo(db.User,{
    foreignKey: "user_comment_Id",
    as:"User"
})

db.User.hasMany(db.Reporting, {
    foreignKey: "user_Id",
    as: "Reporting"
})
db.Reporting.belongsTo(db.User,{
    foreignKey: "user_Id",
    as:"User"
})


db.Chocolate.hasMany(db.Comment, {
    foreignKey: "chocolate_Id",
    as: "Comment",
    onDelelte: "cascade"
})
db.Comment.belongsTo(db.Chocolate, {
    foreignKey: "chocolate_Id",
    as:"Chocolate"
})

db.Chocolate.hasMany(db.Reporting, {
    foreignKey: "chocolate_Id",
    as: "Reporting",
    onDelelte: "cascade"
})
db.Reporting.belongsTo(db.Chocolate,{
    foreignKey: "chocolate_Id",
    as:"Chocolate"
})
db.Comment_Rating = sequelize.define("Comment_Rating", {}, { timestamps: false });
db.Comment.belongsToMany(db.Rating
    , {
    // foreignKey: { name: "comment_Id_test"},
    // as: "Comment",
    // allowNull:true
    through: db.Comment_Rating
    }
)
db.Rating.belongsToMany(db.Comment, {
    through: db.Comment_Rating
})

// db.Rating.hasOne(db.Comment
//     , {
//     // foreignKey: { name: "rating_Id_test"},
//     // as: "Rating",
//     // allowNull:true
//     through: db.Comment_Rating
//     }
// )
// db.Comment.belongsTo(db.Rating)

//delete for production
async function  initial() {
    db.role.create({
        id: 1,
        name: "user"
    })
     
    db.role.create({
        id: 2,
        name: "admin"
    })
    await db.User.create({
        username: "anAdmin",
        email: "anAdmin@gmail.com",
        password: bcrypt.hashSync("password", 8),
        roles: ["user", "admin"]
    })
    db.Chocolate.create({
        "name": "L'Atelier",
        "addressShop": "16 Av. du Maréchal Foch, 91230 Montgeron, France",
        "position": "(48.71059349999999, 2.4651571)",
        "user_Id": 1,
        "allowed": false,
        "price": 5,
        "hours": "[\"lun\"]",
    })
}
// db.sequelize.sync({force: true}).then(() => {
//     console.log("Drop and Resync Database")
//     initial()
// })

// uncomment for production
db.sequelize.sync({alter: true})

module.exports = db