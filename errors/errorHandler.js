const errorHandler = (err, req, res, next) => {

    // 0 - Message simple
    // 1 - Message sans ereurs
    // 2 - Toutes les informations
    
    debugLevel = 2
    message = {}

    switch(debugLevel) {
        case 0:
            if (err.name === "SequelizeDatabaseError") {
                console.log("sequelize error")
                message = { message: "DataBase Error" }

            } else {
                message = { message: err.message }
            }
        break
        case 1:
            message = { message: err.message }
        break
        case 2:
            message = { message: err.message, error: err }
        break
        default: 
            console.log("bad debugLevel")
    }

    return res.status(err.statusCode || 500).json({ message: message})
}

module.exports = errorHandler