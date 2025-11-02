const db = require('../config/database');

const MaintenanceRequest = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM maintenance_requests', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM maintenance_requests WHERE request_id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO maintenance_requests SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ request_id: result.insertId, ...data });
      });
    });
  },

  update: (id, data) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE maintenance_requests SET ? WHERE request_id = ?', [data, id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows ? { request_id: id, ...data } : null);
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM maintenance_requests WHERE request_id = ?', [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
};

module.exports = MaintenanceRequest;