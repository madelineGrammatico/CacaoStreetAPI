const express = require('express')
const cors = require("cors")
let DB =require('./db.config')
const errorHandler =  require("./errors/errorHandler")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const user_router = require('./routes/users')
const auth_router = require('./routes/auth')
const chocolate_router = require('./routes/chocolate')

app.use('/users', user_router)
// app.get('/', (req, res) => {
//     res.send("In progress")
// })
app.use('/auth', auth_router)
app.use('/chocolate', chocolate_router)

app.get('/*', (req, res) => {
    res.status(501).send("What the hell are you doing !?!")
})
app.use(errorHandler)


DB.authenticate()
    .then(() => { console.log("Datatbase connection Ok")})
    .then(() => {
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`App listenning on port ${process.env.SERVER_PORT}!`)
        })
    })
    .catch(error => console.log("database error", error))
