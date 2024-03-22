
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
        allowNull: false,
        validate: {
            isEmail: true
        }
      },
      password: {
        type: Sequelize.STRING(64),
        is: /^[0-9a-f]{64}$/i
      }
    },{ paranoid: true})
  
    return User
  }

//     User.beforeCreate(async (user, option)=> {
//         const hash = await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT_ROUND))
//         user.password = hash
//     })
//     User.checkPassword = (async (password, original)=> {
//         return await bcrypt.compare(password, original)
//     })

//     return User
// }
