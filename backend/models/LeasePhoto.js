const db = require('../config/database');

const LeasePhoto = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_photos', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findByLease: (leaseId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_photos WHERE lease_id = ?', [leaseId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO lease_photos SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ photo_id: result.insertId, ...data });
      });
    });
  },

  delete: (photoId) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM lease_photos WHERE photo_id = ?', [photoId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
};

module.exports = LeasePhoto;