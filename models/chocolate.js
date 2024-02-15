const { DataTypes } = require('sequelize')
const DB = require("../db.config")

const Chocolate = DB.define("Chocolate", {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    addressShop: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rate: {
        type: DataTypes.INTEGER(1),
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    hours: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{ paranoid: true})

// User.sync()
// User.sync({ force: true })
// User.sync({ alter: true })

module.exports = Chocolate