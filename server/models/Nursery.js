const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Nursery = sequelize.define('Nursery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  licenseNumber: {
    type: DataTypes.STRING,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'nursery',
  },
  totalSales: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 4.5,
  },
  otp: {
    type: DataTypes.STRING,
  },
  otpExpires: {
    type: DataTypes.DATE,
  },
  flowerPotAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Nursery;
