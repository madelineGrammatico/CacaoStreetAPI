
const {UserError, RequestError } = require('../errors/customError')
const DB = require("../db.config")
const Admin = DB.Admin
const bcrypt = require('bcrypt')

exports.getAllAdmins = (req, res) => {
    Admin.findAll()
        .then( admins => res.json({data: admins}))
        .catch(err => { next(err)})
}

exports.getAdmin = async (req, res, next) => {
    try {
        const adminId = parseInt(req.params.id)
        if(!adminId) {
            // return res.json(400).json({ message: "Missing Parameter"})
            throw new RequestError("Missing Parameter")
        }

        const admin = await Admin.findOne({ where: { id: adminId }, raw: true, attributes: ["id", "pseudo", "email"] })
        if((admin === null)) {
            // return res.status(404).json({ message: "This user does not exist !"})
            throw new UserError("This admin does not exist !", 0)
        }

        return res.json({data: admin})

    } catch(err) {
        // res.status(err.statusCode || 500).json({ message: err.message, error: err})
        next(err)
    }
}

exports.addAdmin = async ( req, res, next) => {
    try {
        const {pseudo, email, password } = req.body
        if(!pseudo || !email || !password) {
            // return res.status(400).json({ message: "Missing Data" })
            throw new RequestError("Missing Data")
        }

        const admin = await Admin.findOne({where: { email: email}, raw: true})

        if(admin !== null) {
            // return res.status(409).json({ message: `The email ${email} already exists`})
            throw new UserError(`The email ${email} already exists`,1)
        }

        adminCrypted = await Admin.create(req.body)
        return res.json({message: "Admin Created", data: adminCrypted})
        
    } catch(err) {
        // res.status(err.statusCode || 500).json({ message: err.message, error: err})
        next(err)
    }
}

exports.updateAdmin = async (req, res, next) => {
    try {
        const admin_Id = req.auth.admin_Id
        let adminId = parseInt(req.params.id)
        if(!adminId) {
            // return res.status(400).json({ message: "Missing parameter" })
            throw new RequestError("Missing parameter" )
        }

        const admin = await Admin.findOne({ where: {id: adminId}, raw: true})

        if(admin === null) {
            // return res.status(404).json({ message: "This user does not exist !"})
            throw new UserError("This admin does not exist !",0)
        }

        if (admin.id !== admin_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }

        if(req.body.password) {
            const hash = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUND))
            req.body.password = hash
        }
        await Admin.update(req.body, { where: { id: adminId } })
        return res.json({ message: "Admin Updated" })

    } catch(err) {
        // res.status(err.statusCode || 500).json({ message: err.message, error: err})
        next(err)
    }
}

// exports.untrashAdmin = async ( req, res, next) => {
//     try {
//         // const admin_Id = req.auth.admin_Id
//         let adminId = parseInt(req.params.id)
//         if(!adminId) {
//             throw new RequestError("Missing parameter")
//         }

//         // const admin = await Admin.findOne({ where: {id: adminId}, raw: true})
//         // if (admin.id !== admin_Id) {
//         //     return res.json(404).json({ message: "You don't have the right for this"})
//         // }

//         await Admin.restore({ where : {id: adminId}})
//         return res.status(204).json({})
//     } catch(err) {
//         next(err)
//     }
// }

// exports.trashAdmin = async (req, res, next) => {
//     try {
//         const admin_Id = req.auth.admin_Id
//         let adminId = parseInt(req.params.id)
//         if(!adminId) {
//            throw new RequestError("Missing parameter")
//         }

//         const admin = await Admin.findOne({ where: {id: adminId}, raw: true})
//         if (admin.id !== admin_Id) {
//             return res.json(404).json({ message: "You don't have the right for this"})
//         }
        
//         await Admin.destroy({ where: {id: adminId}})
//         return  res.status(204).json({})
//     } catch(err) {
//         next(err)
//     }
// }

exports.deleteAdmin = async (req, res, next) => {
    try {
        const admin_Id = req.auth.admin_Id
        let adminId = parseInt(req.params.id)
        if(!adminId) {
            throw new RequestError("Missing parameter")
        }
        
        const admin = await Admin.findOne({ where: {id: adminId}, raw: true})
        if (admin.id !== admin_Id) {
            return res.json(404).json({ message: "You don't have the right for this"})
        }

        await Admin.destroy({ where: {id: adminId}, force: true})
        return res.status(204).json({})

    } catch(err) { next(err) }
}
