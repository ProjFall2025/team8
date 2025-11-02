const db = require('../config/database');

const TenantHistory = {
  findByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tenant_history WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO tenant_history SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ history_id: result.insertId, ...data });
      });
    });
  }
};

module.exports = TenantHistory;