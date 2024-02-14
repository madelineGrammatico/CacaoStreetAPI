class MainError extends Error {
    constructor(errorMessage, errorType = "") {
        super()

        this.name = this.constructor.name
        this.message = errorMessage

        switch(this.constructor.name) {
            case "AuthentificationError":
                if(errorType === 0) {
                    this.statusCode = 400
                } else if(errorType === 1) {
                    this.statusCode = 401
                } else {
                    this.statusCode = 404
                }
            break
            case "UserError":
                if(errorType === 0) {
                    this.statusCode = 404
                } else {
                    this.statusCode = 409
                }
            break
            case "RequestError":
                this.statusCode = 400
            break
            default:
                console.log("No handler error for that")
        }
    }
}

class AuthentificationError extends MainError{}
class UserError extends MainError{}
class RequestError extends MainError{}

module.exports = { MainError, AuthentificationError, UserError, RequestError}