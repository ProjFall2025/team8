const db = require('../config/database');

const Payments = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM payments', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM payments WHERE payment_id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  findByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM payments WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findByLease: (leaseId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM payments WHERE lease_id = ?', [leaseId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO payments SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ payment_id: result.insertId, ...data });
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM payments WHERE payment_id = ?', [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
};

module.exports = Payments;