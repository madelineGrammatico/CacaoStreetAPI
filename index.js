const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send("Home in progress")
})
app.get('/selections', (req, res) => {
    res.send("selections in comming")
})
app.get('/connection', (req, res) => {
    res.send("Login and SignIn soon")
})
app.listen(port, () => {
    console.log(`App listenning on port ${port}!`)
})