const db = require("../config/DB_Config");
const { hashSync, genSaltSync } = require("bcrypt");
const { userValidationSchema } = require('../validation/userSchema');
const joi = require('joi');
let userSchemas = db.users;
let roleSchema = db.roles;
let user_roleScma = db.user_role;

// Get all users........
const allUsers = async (req,res)=>{
    try {
        let users = await userSchemas.findAll();
        if (!users) {
            return res.status(404).json({message: "No user registard yet..."});
        } else {
            return res.status(200).json({message: users});
        }
    } catch (error) {
        return res.status(500).json({error: error});
    }
};

// Users find by id.......
const usersByid = async (req,res)=>{
    let id = req.params.id;
    try {
        let userbyId = await userSchemas.findOne({
            include: [{
                model: roleSchema,
                attributes: ["id", "titles"]
            }],
            where: {
                id: id
            }
        });
        if (!userbyId) {
            return res.status(404).json({message: "No user found with this ID..."});
        } else {
            return res.status(200).json({message: userbyId});
        }
    } catch (error) {
        return res.status(500).json({error: error});
    }
};

// addUser to database.......
const addNewuser = async (req,res)=>{
    let findUser = await userSchemas.findOne({ where: { email_id: req.body.email_id } });
    if (!findUser) {
        try {
            let validate = await userValidationSchema.validateAsync(req.body, { abortEarly: false, allowUnknown: true });
            let hashPassword = hashSync(validate.password, genSaltSync(10));
            let userData  = {
                first_name: validate.first_name,
                last_name: validate.last_name,
                email_id: validate.email_id,
                password: hashPassword
            };
            let role = validate.role_id;
            let addUsers = await userSchemas.create(userData);
            if ( addUsers && addUsers.id ) {
                await user_roleScma.create({ userId: addUsers.id, roleId: role}).then(() => {
                    return res.status(200).json({message: "New user added successfully..."});
                }).catch((err) => {
                    return res.status(404).json({error: err});
                });
            }
        } catch (error) {
            let err = [];
            error.details.forEach((e) => {
                err.push({keys: e.path[0], message: e.message})
            });
            return res.status(406).json({error: !err ? error : err});
        }      
    } else {
        return res.status(404).json({message: "User already exist..."});
    }
};

// Update or edit user details...
const updateUser = async (req,res)=>{
    let userID = req.params.id;
    let first_name = joi.object({   // First name validate....
        first_name: joi.string()
    .min(3)
    .max(10)
    .required()
    .messages({"string.empty": "First name is not allowed to be empty"}),
    })
    if (req.body.hasOwnProperty("first_name")) {
        try {
            let validate = await first_name.validateAsync(req.body, { allowUnknown: true });
            let data = {
                first_name: validate.first_name, 
                updated_At: Date.now()
            }
            let updated = await userSchemas.update(data, { where: { id: userID } });
            if (updated[0] === 0) {
                    return res.status(406).json({message: "No user found with this ID..."});
                } else {
                    return res.status(200).json({message: "User details updated..."});
                }
        } catch (error) {
            let err = [];
            error.details.forEach((e) => {
                err.push({keys: e.path[0], message: e.message})
            });
            return res.status(406).json({error: !err ? error : err});
        }
    };

    // Last name validate....
    let last_name = joi.object({
        last_name: joi.string()
        .min(3)
        .max(10)
        .required()
        .messages({"string.empty": "Last name is not allowed to be empty"})
    });
    if (req.body.hasOwnProperty("last_name")) {
        try {
            let validate = await last_name.validateAsync(req.body);
            let data = {last_name: validate.first_name, updated_At: Date.now()}
            let updated = await userSchemas.update(data, { where: { id: userID } });
            if (updated[0] === 0) {
                    return res.status(406).json({message: "No user found with this ID..."});
                } else {
                    return res.status(200).json({message: "User details updated..."});
                }
        } catch (error) {
            let err = [];
            error.details.forEach((e) => {
                err.push({keys: e.path[0], message: e.message})
            });
            return res.status(406).json({error: !err ? error : err});
        }
    };

    // Email id validation.....
    let email_id = joi.object({
        email_id: joi.string()
        .lowercase()
        .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .required()
        .messages({
            "string.empty": "Email id, is not allowed to be empty",
            "string.pattern.base": "Email id, Must Match The Required Patterns"
        })
    })
    if (req.body.hasOwnProperty("email_id")) {
        try {
            let validate = await email_id.validateAsync(req.body);
            let data = {email_id: validate.first_name, updated_At: Date.now() }
            let updated = await userSchemas.update(data, { where: { id: userID } });
            if (updated[0] === 0) {
                    return res.status(406).json({message: "No user found with this ID..."});
                } else {
                    return res.status(200).json({message: "User details updated..."});
                }
        } catch (error) {
            let err = [];
            error.details.forEach((e) => {
                err.push({keys: e.path[0], message: e.message})
            });
            return res.status(406).json({error: !err ? error : err});
        }
    };

    // Password validation....
    let password = joi.object({
        password: joi.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/)
        .required()
        .messages({
        "string.empty": "Password, is not allowed to be empty",
        "string.pattern.base": "Password must 8 characters long, with Uppercase, numbers & special characters"
    })
    });
    if (req.body.hasOwnProperty("password")) {
        try {
            let validate = await password.validateAsync(req.body);
            let updated = await userSchemas.update({password: validate.password}, { where: { id: userID } });
            if (updated[0] === 0) {
                    return res.status(406).json({message: "No user found with this ID..."});
                } else {
                    return res.status(200).json({message: "User details updated..."});
                }
        } catch (error) {
            let err = [];
            error.details.forEach((e) => {
                err.push({keys: e.path[0], message: e.message})
            });
            return res.status(406).json({error: !err ? error : err});
        }
    }
}

//Soft delete user......
const deleteUser = async(req,res)=>{
    let userId = req.params.id;

    try {
        let deleteuser = await userSchemas.update({isDeleted: 1}, { where: { id: userId } });
        console.log(deleteUser)
        if (deleteuser[0] === 0) {
            return res.status(404).json({message: "User not found..."});
        } else {
            return res.status(200).json({message: "User deleted successfully"});
        }
    } catch (error) {
        return res.status(500).json({error: error});
    }
}
module.exports = { allUsers, usersByid, addNewuser, updateUser, deleteUser }