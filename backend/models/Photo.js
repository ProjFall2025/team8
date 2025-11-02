const db = require('../config/database');

const Photo = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM photos', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM photos WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO photos SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ photo_id: result.insertId, ...data });
      });
    });
  },

  delete: (photoId) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM photos WHERE photo_id = ?', [photoId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
};

module.exports = Photo;