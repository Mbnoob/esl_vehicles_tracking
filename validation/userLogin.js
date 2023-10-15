const joi = require('joi');

const userLoginScma = joi.object({
    email_id: joi.string()
    .lowercase()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required()
    .messages({
        "string.empty": "Email id, is not allowed to be empty",
        "string.email": "Email id, Must Match The Required Patterns",
    }),

    password: joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/)
    .required()
    .messages({"string.pattern.base": "Password must 8 characters long, with Uppercase, numbers & special characters"})
});

module.exports = {userLoginScma};