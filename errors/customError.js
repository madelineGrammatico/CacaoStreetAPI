class MainError extends Error {

    constructor(errrorMessage, errorType = "") {
        super()
        switch(this.constructor.name) {
            case "AuthentificationError":
                console.log("Authentification error")
            break
            case"UserError":
                console.log("User Error")
            break
           
            case"RequestError":
                console.log("Request Error")
            break
            default:
                console.log("les autres")
        }
    }
}

class AuthentificationError extends MainError{}
class UserError extends MainError{}
class RequestError extends MainError{}

module.exports = { MainError, AuthentificationError, UserError, RequestError}