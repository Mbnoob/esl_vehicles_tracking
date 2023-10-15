const db = require("../config/DB_Config");
const { vehicleSchema } = require('../validation/vehicles');
const joi = require('joi');
const vehicleDb = db.vehicles;
const vehicle_types = db.vehicle_types;
const user_has_vehicle = db.user_has_vehicles;

// List of vehicles....
const allVehicles = async (req, res) => {
  try {
    let vehicles = await vehicleDb.findAll({});
    if (!vehicles[0]) {
        return res.status(406).json({message: "No vehicles add yet..."})
    } else {
        return res.status(200).json({message: vehicles});
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

// Search by names.....
const vehiclesByName = async (req,res)=>{
    let v_id = req.params.id;
    try {
        let getVehicle = await vehicleDb.findOne({ 
            include: [{
                model: vehicle_types
            }],
            where: { 
                id: v_id
             } 
        });
        if (!getVehicle) {
            return res.status(406).json({message: "No vehicles have with this name..."});
        } else {
            return res.status(200).json({message: getVehicle});
        }
    } catch (error) {
        return res.status(500).json({ error: error });
    }
};

// Add new one......
const addVehicles = async(req,res)=>{
    try {
        let validated = await vehicleSchema.validateAsync(req.body, { abortEarly: false, allowUnknown: true });
        let addDate = {
            make: validated.make,
            model: validated.model,
            vin: validated.vin,
            registration_plate: validated.registration_plate,
            fuel_type: validated.fuel_type,
            vehicles_type_id: validated.vehicles_type_id
        };
        let user_Id = validated.userId;
        let type_Id = validated.type_Id;
        let addVehicles = await vehicleDb.create(addDate);
        if (addVehicles && addVehicles.id) {
          await user_has_vehicle.create({ userId: user_Id, vehicle_Id: addVehicles.id, type_Id: type_Id }).then(() => {
            return res.status(200).json({message: "New vehicles and user are are created..."});
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
};

// Edit vehicles.....
const editVehicles = async(req,res)=>{
    let v_id = req.params.id;
    let make = joi.object({
        make: joi.string()
        .min(3)
        .max(10)
        .required()
        .messages({"string.empty": "Make is not allowed to be empty"}),
        });
        if (req.body.hasOwnProperty("make")) {
            try {
                let validate = await make.validateAsync(req.body, { allowUnknown: true });
                let data = {
                    make: validate.make,
                    updateAt: Date.now()
                };
                let updateMake = await vehicleDb.update(data, { where:{ id: v_id }});
                if (updateMake[0] === 0) {
                    return res.status(406).json({ message: "User not found..."});
                } else {
                    return res.status(200).json({message: "Data Updated successfully..."});
                }
            } catch (error) {
                let err = [];
                error.details.forEach((e) => {
                    err.push({keys: e.path[0], message: e.message})
                });
                return res.status(406).json({error: !err ? error : err});
            }
        };

    // Model validation....
    let model = joi.object({
        model: joi.string()
        .required()
        .messages({"string.empty": "Model is not allowed to be empty"})
    });
    if (req.body.hasOwnProperty("model")) {
        try {
            let validate = await model.validateAsync(req.body);
            let data = {
                model: validate.model,
                update_At: Date.now() 
            };
            let update = await vehicleDb.update(data);
            if (update[0] === 0) {
                return res.status(406).json({ message: "User not found..."});
            }else{
                return res.status(200).json({message: "Data Updated successfully..."});
            }
        } catch (error) {
            let err = [];
                error.details.forEach((e) => {
                    err.push({keys: e.path[0], message: e.message})
                });
            return res.status(406).json({error: !err ? error : err});
        }
    };

    // Vehicles Id....
    let Vehicles_Id = joi.object({
        vin: joi.string()
        .required()
        .messages({"string.empty": "Vehicles ID is not allowed to be empty"}),
    });
    if (req.body.hasOwnProperty("vin")) {
       try {
        let validate = await Vehicles_Id.validateAsync(req.body);
        let data = {
            vin: validate.vin,
            update_At: Date.now()
        };
        let VinUpdate = await vehicleDb.update(data);
        if (VinUpdate[0]===0) {
            return res.status(406).json({ message: "User not found..."});
        } else {
            return res.status(200).json({message: "Data Updated successfully..."}); 
        }
       } catch (error) {
        let err = [];
                error.details.forEach((e) => {
                    err.push({keys: e.path[0], message: e.message})
                });
            return res.status(406).json({error: !err ? error : err});
       }
    };

    //registration plate Validation....
    let reg_plate = joi.object({
        registration_plate: joi.string()
        .min(5)
        .max(30)
        .required()
        .messages({"string.empty": "Registration plate is not allowed to be empty"})
    });
    if (req.body.hasOwnProperty("registration_plate")) {
        try {
            let validate = await reg_plate.validateAsync(req.body);
            let data = {
                registration_plate : validate.registration_plate,
                update_At : Date.now()
            };
            let updateReg = await vehicleDb.update(data);
            if (updateReg[0] === 0) {
                return res.status(406).json({ message: "User not found..."}); 
            } else {
                return res.status(200).json({message: "Data Updated successfully..."}); 
            }
        } catch (error) {
            let err = []
            error.details.forEach((e) => {
                err.push({keys: e.path[0], message: e.message})
            });
        return res.status(406).json({error: !err ? error : err});  
        }
    };

    // fuel type Validation....
    let fuel_type = joi.object({
        fuel_type: joi.string()
            .valid('gasoline', 'diesel', 'electric')
            .required()
            .messages({"string.empty": "Fuel type is not allowed to be empty"})
    });
    if (req.body.hasOwnProperty("fuel_type")) {
        try {
            let validate = await fuel_type.validateAsync(req.body);
            let data = {
                fuel_type: validate.fuel_type,
                update_At: Date.now()
            };
            let update = await vehicleDb.update(data);
            if (update[0] === 0) {
                return res.status(406).json({ message: "User not found..."}); 
            } else {
                return res.status(200).json({message: "Data Updated successfully..."});
            }
        } catch (error) {
            let err = []
            error.details.forEach((e) => {
                err.push({keys: e.path[0], message: e.message})
            });
        return res.status(406).json({error: !err ? error : err}); 
        }
    };
}

// Soft delete ......
const deleteVehicles = async(req,res)=>{
    let v_id = req.params.id;
    try {
        let deleteData = await vehicleDb.update({ isDeleted: 1 }, { where: { id: v_id } });
        if (deleteData[0] === 0) {
            return res.status(404).json({message: "Id invalid, please try again..."});
        } else {
            return res.status(200).json({message: "Deta Deleted successfully..."});
        }
    } catch (error) {
        return res.status(500).json({error: err});
    }
}

// try {
//     vehicleDb.beforeUpdate((vehicleDb, options) => {
//         vehicleDb.updated_at = new Date(); // Set the updated_at field to the current timestamp
//       });          
//     let editData = vehicleDb.update(bodyData, { where: { id: v_id }});
//     if (editData[0] === 0) {
//         return res.status(404).json({ message: "No vehicles found with this ID..."});
//     } else {
//         return res.status(200).json({message: "Vehicles edited..."});
//     }
// } catch (error) {
//     return res.status(500).json({error: "Server not working..."}); 
// }
module.exports = { allVehicles, vehiclesByName, addVehicles, editVehicles, deleteVehicles };
