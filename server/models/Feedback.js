const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nurseryId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Allow general feedback too
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true, // Only one rating per order
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'General',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Feedback;
