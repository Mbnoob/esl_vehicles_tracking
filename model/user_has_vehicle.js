module.exports = (DataTypes, Sequelize, connection, user, vehicles, vehicle_types) => {
  const userHasVehicles = connection.define('user_has_vehicles',{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Set as the primary key
      autoIncrement: true, // Automatically generate an ID
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: user,
        key: "id"
      }
    },
    vehicle_Id: {
      type: DataTypes.INTEGER,
      references: {
        model: vehicles,
        key: "id",
      }
    },
    type_Id: {
      type: DataTypes.INTEGER,
      references: {
        model: vehicle_types,
        key: "id",
      }
    },
    created_At: {
      field: "created_at",
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
    updated_At: {
        field: "updated_at",
        type: DataTypes.DATE,
        allowNull: true,
    }
  },{
    timestamps: false
  });
  return userHasVehicles;
};
