const db = require('../config/database');

const Document = {
  findByLease: (leaseId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM documents WHERE lease_id = ?', [leaseId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO documents SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  }
};

module.exports = Document;