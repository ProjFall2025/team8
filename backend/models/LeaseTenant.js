const db = require('../config/database');

const LeaseTenant = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_tenants', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findByLease: (leaseId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_tenants WHERE lease_id = ?', [leaseId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_tenants WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  addTenant: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO lease_tenants SET ?', data, (err, result) => {
        if (err) return reject(err);
        db.query('SELECT * FROM lease_tenants WHERE lease_id = ?', [data.lease_id], (err2, results) => {
          if (err2) return reject(err2);
          resolve(results);
        });
      });
    });
  },

  removeTenant: (data) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM lease_tenants WHERE lease_id = ? AND user_id = ?', [data.lease_id, data.user_id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
};

module.exports = LeaseTenant;