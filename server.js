const express = require('express')
const cors = require("cors")
let DB =require('./db.config')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const user_router = require("./routes/users")
app.use('/users', user_router)

app.get('/', (req, res) => {
    res.send("Home in progress")
})
app.get('/selections', (req, res) => {
    res.send("selections in comming")
})
app.get('/connection', (req, res) => {
    res.send("Login and SignIn soon")
})
app.get('/*', (req, res) => {
    res.status(501).send("What the hell are you doing !?!")
})
DB.authenticate()
    .then( () => { console.log("Datatbase connection Ok")})
    .then(() => {
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`App listenning on port ${process.env.SERVER_PORT}!`)
        })
    })
    .catch(error => console.log("database error", error))
