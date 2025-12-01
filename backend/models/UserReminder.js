const db = require('../config/database');

const UserReminder = {
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
  }
};

module.exports = UserReminder;