module.exports = (DataTypes, Sequelize, connection)=>{
    const vehicleTypes = connection.define("vehicle_types" ,{
        type_name: {
            type: DataTypes.STRING,         //the vehicle type (e.g., Sedan, SUV, Truck, Motorcycle).
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        seating_capacity: {
            type: DataTypes.STRING,
            allowNull: false
        },
        usage: {                                  
            type: DataTypes.STRING,
            allowNull: false                  //use or purpose of the vehicle type
        },
        description: DataTypes.STRING,
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
    return vehicleTypes;
}