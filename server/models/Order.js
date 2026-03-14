const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nurseryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: DataTypes.STRING,
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  isRated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // pending, processing, shipped, delivered, cancelled
  items: {
    type: DataTypes.JSON, // Stores array of {plantId, plantTitle, quantity, price}
    allowNull: false,
  },
});

module.exports = Order;
