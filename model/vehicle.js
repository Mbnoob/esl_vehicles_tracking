
module.exports = (DataTypes, Sequelize, connection)=>{
    const vehicleSchema = connection.define("vehicles" ,{
        make: {
            type: DataTypes.STRING,      // company names
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        vin: DataTypes.STRING,
        registration_plate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fuel_type: {
            type: DataTypes.ENUM('gasoline', 'diesel', 'electric'),
            allowNull: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        vehicles_type_id: {
            type: DataTypes.INTEGER,
            allowNull: true
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
    });
    return vehicleSchema;
}