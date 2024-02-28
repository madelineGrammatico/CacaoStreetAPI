const { DataTypes } = require('sequelize')
// const DB = require("../db.config")
module.exports = (sequelize) => {
    const Reporting = sequelize.define("Reporting", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        body: {
            type: DataTypes.STRING(550),
            allowNull: false
        },
        chocolate_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isClose: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
        
    })
    return Reporting
}


// User.sync()
// User.sync({ force: true })
// User.sync({ alter: true })

// module.exports = Comment