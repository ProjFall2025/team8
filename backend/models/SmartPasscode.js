const db = require('../config/database');

const SmartPasscode = {
  findByLease: (leaseId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM smart_passcodes WHERE lease_id = ?', [leaseId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO smart_passcodes SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ passcode_id: result.insertId, ...data });
      });
    });
  },

  delete: (passcodeId) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM smart_passcodes WHERE passcode_id = ?', [passcodeId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
};

module.exports = SmartPasscode;