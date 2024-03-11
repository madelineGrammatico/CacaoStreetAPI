const express = require('express')
const cors = require("cors")
let DB = require('./db.config')
const errorHandler =  require("./errors/errorHandler")

const app = express()
app.use(cors(
    // {
    // origin: "http://127.0.0.1:5500",
    // methods: "GET, POST, PATCH, DELETE",
    // allowedHeaders: "Origin, X-Requested-With, x-acces-token, role, Content, Accept, Content-Type, Authorization"
    // }
))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// const user_router = require('./routes/users')
// const auth_router = require('./routes/auth')
const chocolate_router = require('./routes/chocolate')
const comment_router = require('./routes/comment')
const reporting_router = require('./routes/reporting')
const rating_router =require("./routes/rating")

// app.use('/users', user_router)
// app.use('/auth', auth_router)
app.use('/chocolate', chocolate_router)
app.use('/comment', comment_router)
app.use('/reporting', reporting_router)
app.use('/rating', rating_router)

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.get('/*', (req, res) => {
    res.status(501).send("What the hell are you doing !?!")
})
app.use(errorHandler)


DB.sequelize.authenticate()
    .then(() => { console.log("Datatbase connection Ok")})
    .then(() => {
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`App listenning on port ${process.env.SERVER_PORT}!`)
        })
    })
    .catch(error => console.log("database error", error))
