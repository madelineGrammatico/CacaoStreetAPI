class UserError extends Error {
    constructor(errormessage) {
        super()

        this.name = "UserError"
        this.message = `message: ${errormessage}`
        this.statusCode = 400
    }
}

module.exports = UserError