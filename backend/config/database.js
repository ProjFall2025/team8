const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,         
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: process.env.DB_CA            
  }
});

db.getConnection()
  .then(() => {
    console.log('✅ Connected to TiDB Cloud with SSL');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });

module.exports = db;
