const joi = require('joi');

const userValidationSchema = joi.object({
    first_name: joi.string()
    .min(3)
    .max(10)
    .required()
    .messages({"string.empty": "First name is not allowed to be empty"}),

    last_name: joi.string()
    .min(3)
    .max(10)
    .required()
    .messages({"string.empty": "Last name is not allowed to be empty"}),

    email_id: joi.string()
    .lowercase()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required()
    .messages({
        "string.empty": "Email id, is not allowed to be empty",
        "string.pattern.base": "Email id, Must Match The Required Patterns",
    }),

    password: joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/)
    .required()
    .messages({
        "string.empty": "Password, is not allowed to be empty",
        "string.pattern.base": "Password must 8 characters long, with Uppercase, numbers & special characters"
    })
});

module.exports = { userValidationSchema };