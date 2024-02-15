const { DataTypes } = require('sequelize')
const DB = require("../db.config")

const Comment = DB.define("Comment", {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    body: {
        type: DataTypes.STRING(550),
        allowNull: false
    },
    rate: {
        type: DataTypes.INTEGER(1),
        allowNull: false
    },
    
})

// User.sync()
// User.sync({ force: true })
// User.sync({ alter: true })

module.exports = Comment