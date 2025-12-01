const db = require('../config/database');

const UserReminder = {
<<<<<<< HEAD
  // Get all reminders for a user
  findByUser: async (userId) => {
    const [rows] = await db.query(
      `SELECT reminder_id, type, message, remind_at, is_sent
       FROM userreminders
       WHERE user_id = ?
       ORDER BY remind_at ASC`,
      [userId]
    );
    return rows;
  },

  // Create a new reminder
  create: async (data) => {
    const [result] = await db.query('INSERT INTO userreminders SET ?', data);
    return { reminder_id: result.insertId, ...data };
  },

  // Delete a reminder by ID
  delete: async (reminderId) => {
    const [result] = await db.query(
      'DELETE FROM userreminders WHERE reminder_id = ?',
      [reminderId]
    );
    return result.affectedRows > 0;
=======
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
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  }
};

module.exports = UserReminder;