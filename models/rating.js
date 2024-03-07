const { DataTypes } = require('sequelize')
module.exports = (sequelize) => {
    const Rating = sequelize.define("Rating", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        
        rate: {
            type: DataTypes.INTEGER(1),
            allowNull: false
        },
        chocolate_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
        
    })
    return Rating
}


// User.sync()
// User.sync({ force: true })
// User.sync({ alter: true })

// module.exports = Rating