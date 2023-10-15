const { Sequelize, DataTypes } = require('sequelize');

const connection = new Sequelize('esl_vehicle_tracking', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: true
});

try {
    connection.authenticate();
    console.log("Connection has been established successfully...");
} catch (error) {
    console.error(error);
}

const db = {};

db.Sequelize = Sequelize;
db.connection = connection;

// User and role relations & schemas.......
db.users = require('../model/users')(connection, Sequelize, DataTypes); // For user model...
db.roles = require('../model/roles')(DataTypes,Sequelize, connection); // For role model...
db.user_role = require('../model/user_role')(DataTypes, Sequelize, connection, db.users, db.roles); // For user_role relation model...

db.users.belongsToMany(db.roles, { through: db.user_role });
db.roles.belongsToMany(db.users, { through: db.user_role });

// Vehicle and user relations & schemas......
db.vehicles = require('../model/vehicle')(DataTypes, Sequelize, connection);
db.vehicle_types = require('../model/vehicle_types')(DataTypes, Sequelize, connection);
db.user_has_vehicles = require('../model/user_has_vehicle')(DataTypes, Sequelize, connection, db.users, db.vehicles, db.vehicle_types);

db.vehicle_types.hasOne(db.vehicles, { foreignKey: 'vehicles_type_id' });
db.vehicles.belongsTo(db.vehicle_types, { foreignKey: 'vehicles_type_id' });

db.vehicles.belongsToMany(db.vehicle_types, { through: db.user_has_vehicles, foreignKey: 'vehicle_Id' });
db.vehicle_types.belongsToMany(db.vehicles, { through: db.user_has_vehicles, foreignKey: 'type_Id' });
db.vehicles.belongsToMany(db.users, { through: db.user_has_vehicles, foreignKey: "userId"});

//..........Database start..........
db.connection.sync({ force: false });

module.exports = db;
