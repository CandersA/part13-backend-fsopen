const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}
User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    modelName: 'user',
    // Don't return password hashes per default, only return them when called with 'withPassword' scope
    defaultScope: {
        attributes: {
          exclude: ['passwordHash']
        }
    },
    scopes: {
        withPassword: {
            attributes: {
                include: ['passwordHash']
            }
        }
    }
})

module.exports = User