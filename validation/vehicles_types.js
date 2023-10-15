const joi = require('joi');

const vehicles_type_schema = joi.object({
    type_name: joi.string()
    .min(3)
    .max(10)
    .required(),
    seating_capacity: joi.string()
    .required(),
    usage: joi.string()
    .required(),
});

module.exports = { vehicles_type_schema }