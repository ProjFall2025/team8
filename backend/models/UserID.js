const db = require('../config/database');

const UserID = {
  // Find user IDs by user
  findByUser: async (userId) => {
    const [results] = await db.query(
      'SELECT * FROM user_ids WHERE user_id = ?',
      [userId]
    );
    return results;
  },

  // Create new user ID record
  create: async (data) => {
    const [result] = await db.query('INSERT INTO user_ids SET ?', data);
    return { id: result.insertId, ...data };
  },

  // Delete user ID record by ID
  delete: async (id) => {
    const [result] = await db.query(
      'DELETE FROM user_ids WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = UserID;