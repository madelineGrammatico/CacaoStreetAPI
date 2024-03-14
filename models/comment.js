const { DataTypes } = require('sequelize')
// const DB = require("../db.config")
module.exports = (sequelize) => {
    const Comment = sequelize.define("Comment", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        body: {
            type: DataTypes.STRING(550),
            allowNull: false
        },
        // rate: {
        //     type: DataTypes.INTEGER(1),
        //     allowNull: true
        // },
        chocolate_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        
        
    })
    return Comment
}


// User.sync()
// User.sync({ force: true })
// User.sync({ alter: true })

// module.exports = Comment