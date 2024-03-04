const { DataTypes } = require('sequelize')
// const DB = require("../db.config")
module.exports = (sequelize) => {
    const Role = sequelize.define("Role", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return Role
}