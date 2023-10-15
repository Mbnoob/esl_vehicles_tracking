module.exports = (DataTypes, Sequelize, connection, user, role)=>{
const userRole = connection.define('user_roles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Set as the primary key
    autoIncrement: true, // Automatically generate an ID
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: user, 
      key: 'id'
    }
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: role,
      key: 'id'
    }
  },
  created_At: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('NOW')
  },
  updated_At: {
    field: 'updated_at',
    type: DataTypes.DATE,
    allowNull: true,
  }
},{
    timestamps: false
});
    return userRole;
}

// module.exports = (DataTypes, Sequelize, connection)=>{
//   const UserRoles = connection.define('user_roles', {
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     roleId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW,
//     },
//   }, {
//     timestamps: false, // Disable timestamps (created_at, updated_at)
//   });

//     return UserRoles;
// }