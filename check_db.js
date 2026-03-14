const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});

async function checkSchema() {
  try {
    const [results] = await sequelize.query('DESCRIBE Nurseries');
    console.log('SUCCESS_SCHEMA_CHECK');
    console.table(results);
    const [allTables] = await sequelize.query('SHOW TABLES');
    console.log('ALL TABLES:');
    console.table(allTables);
  } catch (err) {
    console.error('ERROR_SCHEMA_CHECK:', err.message);
  } finally {
    await sequelize.close();
  }
}

checkSchema();
