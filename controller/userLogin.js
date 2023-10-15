const db = require("../config/DB_Config");
const userSchema = db.users;
const roleSchema = db.roles;
const { sign } = require("jsonwebtoken");
const { compareSync } = require("bcrypt");
const { userLoginScma }  = require('../validation/userLogin');

const userLogin = async (req,res)=>{
    try {
        let userValid = await userLoginScma.validateAsync(req.body, { abortEarly: false });
        let findUsers = await userSchema.findOne({
            include: [{
                model: roleSchema,
                attributes: ["id", "role"]
            }],
             where: { 
                email_id: userValid.email_id 
            } 
        });
        if (!findUsers) {
            return res.status(404).json({message: "Invalid email id..."});
        } else {
            let comparePassword = compareSync(userValid.password, findUsers.password);
            if (comparePassword) {
                let createToken = sign({result: findUsers}, process.env.JSONSECREAT, {
                    expiresIn: process.env.EXPAIRIN
                })
                await userSchema.update({ token: createToken, updatedAt: Date.now() }, { where: { email_id: userValid.email_id } }).then(() => {
                    return res.status(200).json({
                        message: "Login successfully...",
                        role: findUsers.roles[0].role,
                        token: createToken
                })
            }).catch((err) => {
                    return res.status(404).json({error: err});
                });
            } else {
                return res.status(404).json({message: "invalid password..."});
            }
        }
    } catch (error) {
        let err = []
        error.details.forEach((e)=>{
         err.push({keys: e.path[0], message: e.message})
        })
        return res.status(406).json({error:err});
    }
};

module.exports = {userLogin}