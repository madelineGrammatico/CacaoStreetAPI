const express = require('express')
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

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
app.listen(process.env.SERVER_PORT, () => {
    console.log(`App listenning on port ${process.env.SERVER_PORT}!`)
})