module.exports = (DataTypes, Sequelize, connection)=>{
    const roleSchema = connection.define("roles",{
        role: {
            type: DataTypes.STRING,
            allowNull: false
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
            allowNull: true
        }
    },{
        timestamps: false
    })
    return roleSchema;
};