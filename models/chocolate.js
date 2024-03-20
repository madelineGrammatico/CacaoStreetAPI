const { DataTypes } = require('sequelize')

module.exports =(sequelize) => {
    return Chocolate = sequelize.define("Chocolate", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        user_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        averageRating: {
            type: DataTypes.FLOAT(3),
            allowNull: true
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        hours: {
            type: DataTypes.JSON,
            allowNull: true,
            default: []
        },
        allowed: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    })

}
