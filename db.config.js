const { Sequelize} = require('sequelize')

let sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host : process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
)
sequelize.sync((err) => {
    console.log('Database Error', err)
})

module.exports = sequelize