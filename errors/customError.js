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
            case "ChocolateError":
                if(errorType === 1) {
                    this.statusCode = 409
                } else {
                    this.statusCode = 404
                }
            break
            case "CommentError":
                this.statusCode = 404
            break
            case "RatingError":
                this.statusCode = 404
            break
            case "ReportingError":
                this.statusCode = 404
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
class ChocolateError extends MainError{}
class CommentError extends MainError{}
class RatingError extends MainError{}
class ReportingError extends MainError{}

module.exports = { 
    MainError, 
    AuthentificationError, 
    UserError,
    ChocolateError, 
    CommentError, 
    RequestError, 
    RatingError,
    ReportingError
}