const joi = require('joi');

const vehicleSchema = joi.object({
    make: joi.string()
    .min(3)
    .max(10)
    .required()
    .messages({"string.empty": "Make is not allowed to be empty"}),
    model: joi.string()
    .required()
    .messages({"string.empty": "Model is not allowed to be empty"}),
    vin: joi.string()
    .required()
    .messages({"string.empty": "Vehicles ID is not allowed to be empty"}),
    registration_plate: joi.string()
    .min(5)
    .max(30)
    .required()
    .messages({"string.empty": "Registration plate is not allowed to be empty"}),
    fuel_type: joi.string()
    .valid('gasoline', 'diesel', 'electric')
    .required()
    .messages({"string.empty": "Fuel type is not allowed to be empty"})
})

module.exports = { vehicleSchema }