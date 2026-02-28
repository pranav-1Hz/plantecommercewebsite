const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'plantshop',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root', // Fallback to root if not defined
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
  },
);

module.exports = sequelize;
