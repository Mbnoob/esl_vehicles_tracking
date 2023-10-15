const db = require("../config/DB_Config");
const { hashSync, genSaltSync } = require("bcrypt");
const userSchemas = db.users;
const roleSchema = db.roles;
const user_role = db.user_role;
const vehicles_types = db.vehicle_types;

const addPreload = async (req, res) => {
  let hashPassword = hashSync('Debayan123@', genSaltSync(10))
  const userData = {
    first_name: 'Debayan',
    last_name: 'Bain',
    email_id: 'debayan@gmail.com',
    password: hashPassword
  };

  try {
    let bulkRole = await roleSchema.bulkCreate([
      { role: "Admin" },
      { role: "Driver" },
      { role: "Controller" }
    ]);
   if (bulkRole.length > 0) {
    let createVehicle_types = await vehicles_types.bulkCreate([
      { type_name: "Sedan", seating_capacity: "5", usage: "Family car"},
      { type_name: "Truck", seating_capacity: "2-6", usage: "Commercial transportation"},
      { type_name: "Crossover", seating_capacity: "5", usage: "Urban and suburban commuting"}
    ])
    if (createVehicle_types.length > 0) {
      let createUser = await userSchemas.create(userData);
      if (createUser && createUser.id) {
         await user_role.create({ userId: createUser.id, roleId: 1 }).then(() => {
          return res.status(200).json({message: "User, role & user_role are created..."});
        }).catch((err) => {
          return res.status(406).json({error: err});
        });
      }
    }
   } 
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Server is not working"});
  }
};

module.exports = { addPreload };