const db = require('../config/database');

const LeaseArchive = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_archives', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findByLease: (leaseId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_archives WHERE lease_id = ?', [leaseId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO lease_archives SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ archive_id: result.insertId, ...data });
      });
    });
  },

  delete: (archiveId) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM lease_archives WHERE archive_id = ?', [archiveId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
};

module.exports = LeaseArchive;