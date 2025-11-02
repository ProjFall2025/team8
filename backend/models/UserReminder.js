const db = require('../config/database');

const UserReminder = {
  findByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM user_reminders WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO user_reminders SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ reminder_id: result.insertId, ...data });
      });
    });
  },

  delete: (reminderId) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM user_reminders WHERE reminder_id = ?', [reminderId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
};

module.exports = UserReminder;