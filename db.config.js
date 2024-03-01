const { Sequelize} = require('sequelize')

let sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host : process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
)

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./models/user.js")(sequelize, Sequelize);
db.role = require("./models/role.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["user", "admin", "moderator"];

// const db = {}

// db.sequelize = sequelize
// db.User = require("./models/user") (sequelize)
// db.Chocolate =require("./models/chocolate") (sequelize)
// db.Comment = require("./models/comment") (sequelize)
// db.Admin = require("./models/admin") (sequelize)
// db.Reporting = require("./models/reporting") (sequelize)
// db.Role = require("./models/role") (sequelize)

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

// db.Role.belongsToMany(db.User, {
//     through: "user_roles"
// })
// db.User.belongsToMany(db.Role, {
//     through: "user_roles"
// })

// db.ROLES = ["user", "admin", "moderator"]

//delete for production
function initial() {
    db.role.create({
        id: 1,
        name: "user"
    });
     
    db.role.create({
        id: 2,
        name: "moderator"
    });
     
    db.role.create({
        id: 3,
        name: "admin"
    });
}
db.sequelize.sync({force: true}).then(() => {
    console.log("Drop and Resync Database")
    initial()
})

// uncomment for production
// db.sequelize.sync()

module.exports = db