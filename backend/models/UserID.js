const db = require('../config/database');

const UserID = {
  findByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM user_ids WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO user_ids SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, ...data });
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM user_ids WHERE id = ?', [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
};

module.exports = UserID;