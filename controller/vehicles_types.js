const db = require('../config/DB_Config');
const vehicle_types = db.vehicle_types;
const { vehicles_type_schema } = require('../validation/vehicles_types');
const joi = require('joi');

const GetAll = async(req,res)=>{
   try {
    let list = await vehicle_types.findAll();
    if (!list[0]) {
        return res.status(404).json({error: "Type database is empty..."});
    } else {
        return res.status(200).json({message: list});
    }
   } catch (error) {
    return res.status(500).json({error: "Server Problems"});
   }
};

const addType = async(req,res)=>{
    try {
        let validate = await vehicles_type_schema.validateAsync(req.body, { allowUnknown: true, abortEarly: false });
        let data = {
            type_name: validate.type_name,
            seating_capacity: validate.seating_capacity,
            usage: validate.usage,
            description: validate.description
        };
        let create = await vehicle_types.create(data).then(() => {
            return res.status(200).json({message: "New vehicles type added..."});
        }).catch((err) => {
            return res.status(406).json({error: err});
        });
    } catch (error) {
        let err = [];
        error.details.forEach((e) => {
            err.push({keys: e.path[0], message: e.message})
        });
        return res.status(406).json({error: !err ? error : err});
    }
}

const updateType = async(req,res)=>{
    let type_id = req.params.id;

    let type_name = joi.object({
        type_name: joi.string()
        .min(3)
        .max(10)
        .required(),
    });
    if (req.body.hasOwnProperty("type_name")) {
        try {
            let validate = await type_name.validateAsync(req.body, { allowUnknown: true });
            let details = {
                type_name: validate.type_name,
                updated_At: Date.now()
            };
            let updated = await vehicle_types.update(details, { where: { id: type_id } });
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

    let seating_capacity = joi.object({
        seating_capacity: joi.string()
        .required()
    });
    if (req.body.hasOwnProperty("seating_capacity")) {
        try {
            let validates = await seating_capacity.validateAsync(req.body, { allowUnknown: true });
            let data = {
                seating_capacity: validates.seating_capacity,
                updated_At: Date.now()
            };
            let updateDetils = await vehicle_types.update(data, { where:{ id: type_id }});
            if (updateDetils[0] === 0) {
                return res.status(404).json({error: "Types not found with ID..."});
            } else {
                return res.status(200).json({message: "Details Updated..."});
            }
        } catch (error) {
            let err = [];
            error.details.forEach((e) => {
                err.push({keys: e.path[0], message: e.message})
            });
            return res.status(406).json({error: !err ? error : err});
        }
    };

    let usage = joi.object({
        usage: joi.string()
    .required()
    });
    if (req.body.hasOwnProperty("usage")) {
        try {
        let validates = usage.validateAsync(req.body, { allowUnknown: true });
        let data = {
            usage: validates.usage,
            updated_At: Date.now()
        }
        let updateData = await vehicle_types.update(data, { where: { id: type_id }});
        if (updateData[0] === 0) {
            return res.status(404).json({error: "Types not found with ID..."});
        } else {
            return res.status(200).json({message: "Details Updated..."});
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

module.exports = { GetAll, addType, updateType };