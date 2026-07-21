const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Apartment = require('./Apartment');

const Wishlist = sequelize.define('Wishlist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },
    apartmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'apartments', key: 'id' },
    },
}, {
    timestamps: true,
    tableName: 'wishlists',
    indexes: [
        { unique: true, fields: ['userId', 'apartmentId'] },
    ],
});

Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Wishlist.belongsTo(Apartment, { foreignKey: 'apartmentId', as: 'apartment' });
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlist' });

module.exports = Wishlist;
