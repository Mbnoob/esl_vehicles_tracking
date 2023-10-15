module.exports = (connection, Sequelize, DataTypes)=>{
    const users = connection.define('users', {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING
        },
        email_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
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
    return users;
}