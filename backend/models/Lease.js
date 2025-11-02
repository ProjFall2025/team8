const db = require('../config/database');

const Lease = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM leases', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM leases WHERE lease_id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO leases SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ lease_id: result.insertId, ...data });
      });
    });
  },

  update: (id, data) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE leases SET ? WHERE lease_id = ?', [data, id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows ? { lease_id: id, ...data } : null);
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM leases WHERE lease_id = ?', [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
};

module.exports = Lease;