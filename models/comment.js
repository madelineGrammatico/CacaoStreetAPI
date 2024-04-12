const { DataTypes } = require('sequelize')

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
        chocolate_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rating_Id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
        
    })
    return Comment
}
