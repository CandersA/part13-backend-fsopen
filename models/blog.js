const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        default: 0
    },
    date: {
        type: DataTypes.DATE,
    },
    year: {
        type: DataTypes.INTEGER,
        defaultValue: new Date().getFullYear()
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})

module.exports = Blog