const db = require("../config/DB_Config");
const joi = require('joi');
let rolesSchemas = db.roles;

// Get all roles........
const allRoles = async(req,res)=>{
    try {
        let allroles = await rolesSchemas.findAll();
        if (!allroles[0]) {
            return res.status(404).json({message: "No role found in database"});
        } else {
            return res.status(200).json({message: allroles});
        }
    } catch (error) {
        return res.status(500).json({error: error});
    }
};

// Add roles to database.......
const addRole = async (req,res)=>{
    let rolesSchema = joi.object({
        role: joi.string()
        .min(3)
        .max(7)
        .required()
    });
    try {
        let validate = await rolesSchema.validateAsync(req.body);
        let roleData = validate.role;
        let addRole = await rolesSchemas.create({role: roleData}).then(() => {
            return res.status(200).json({message: "Role added successfully..."});
        }).catch((err) => {
           return res.status(404).json({error: err}); 
        });
    } catch (error) {
        let err = [];
        error.details.forEach((e) => {
            err.push({keys: e.path[0], message: e.message})
        });
        return res.status(406).json({error: !err ? error : err});
    }
};

// Update Roles.........
const updateRoles = async (req,res)=>{
    let userID = req.params.id;
    let rolesSchema = joi.object({
        role: joi.string()
        .min(3)
        .max(7)
        .required()
    });
    try {
        let validate = await rolesSchema.validateAsync(req.body);
        let data = {
            role: validate.role,
            updated_At: Date.now()
        };
        let editRole = await rolesSchemas.update(data,{
            where:{
                id: userID
            }
        });
        if (editRole[0] === 0) {
            return res.status(404).json({message: "no user found with this Id..."});
        } else {
            return res.status(200).json({message: "Role updated successfully"});
        }
    } catch (error) {
        let err = [];
        error.details.forEach((e) => {
            err.push({keys: e.path[0], message: e.message})
        });
        return res.status(406).json({error: !err ? error : err});
    }
}

module.exports = { allRoles, addRole, updateRoles };