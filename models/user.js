const { DataTypes } = require('sequelize')
const DB = require("../db.config")

const User = DB.define("User", {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    speudo: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
    }, 
    password: {
        type: DataTypes.STRING(64),
        is: /^[0-9a-f]{64}$/i
    }
},{ paranoid: true})

// User.sync()
// User.sync({ force: true })
// User.sync({ alter: true })

module.exports = User