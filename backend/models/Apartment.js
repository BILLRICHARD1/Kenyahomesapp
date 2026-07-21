const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Apartment = sequelize.define('Apartment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('bedsitter', 'studio', '1bedroom', '2bedroom', '3bedroom', 'maisonette'),
        allowNull: false,
    },
    bedrooms: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    bathrooms: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    garages: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    // JSON array of image filenames stored on disk
    images: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const raw = this.getDataValue('images');
            return raw ? JSON.parse(raw) : [];
        },
        set(val) {
            this.setDataValue('images', JSON.stringify(val));
        },
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    rating: {
        type: DataTypes.DECIMAL(3, 1),
        defaultValue: 0.0,
    },
    landlordId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
}, {
    timestamps: true,
    tableName: 'apartments',
});

// Associations
Apartment.belongsTo(User, { foreignKey: 'landlordId', as: 'landlord' });
User.hasMany(Apartment, { foreignKey: 'landlordId', as: 'apartments' });

module.exports = Apartment;
