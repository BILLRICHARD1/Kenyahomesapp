const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',           // Changed to mysql
        logging: false,
        dialectOptions: {
            // Optional: timezone if needed
            // timezone: '+03:00',  // For Nairobi/Kenya
        }
    }
);

module.exports = sequelize;