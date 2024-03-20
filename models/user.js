
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("Users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(64),
        is: /^[0-9a-f]{64}$/i
      }
    },{ paranoid: true})
  
    return User
  }

// const { DataTypes } = require('sequelize');
// const bcrypt = require('bcrypt')

// module.exports =(sequelize) => {
//     const User = sequelize.define("User", {
//         id: {
//             type: DataTypes.INTEGER(11),
//             primaryKey: true,
//             autoIncrement: true
//         },
//         name: {
//             type: DataTypes.STRING(50),
//             unique: true,
//             allowNull: false
//         },
//         email: {
//             type: DataTypes.STRING,
//             validate: {
//                 isEmail: true
//             }
//         }, 
//         password: {
//             type: DataTypes.STRING(64),
//             is: /^[0-9a-f]{64}$/i
//         }
//     },{ paranoid: true})

//     User.beforeCreate(async (user, option)=> {
//         const hash = await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT_ROUND))
//         user.password = hash
//     })
//     User.checkPassword = (async (password, original)=> {
//         return await bcrypt.compare(password, original)
//     })

//     return User
// }
