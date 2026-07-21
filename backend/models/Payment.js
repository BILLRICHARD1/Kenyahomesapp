const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Apartment = require('./Apartment');

// Tracks when a user pays 100 KES to reveal landlord contact for an apartment
const Payment = sequelize.define('Payment', {
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
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 100.00,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'completed', // simplified — in prod integrate M-Pesa
    },
    reference: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'payments',
    indexes: [
        { unique: true, fields: ['userId', 'apartmentId'] },
    ],
});

Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Payment.belongsTo(Apartment, { foreignKey: 'apartmentId', as: 'apartment' });

module.exports = Payment;
