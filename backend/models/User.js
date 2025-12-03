const db = require('../config/database');
const bcrypt = require('bcrypt');

const User = {
  // Find user by email
  findByEmail: async (email) => {
    try {
      const [results] = await db.query(
        'SELECT user_id, name, email, role, password FROM users WHERE email = ?',
       [email]
      );
      return results[0];
    } catch (err) {
      throw err;
    }
  },

  // Find user by ID
  findById: async (id) => {
    try {
      const [results] = await db.query(
        'SELECT * FROM users WHERE user_id = ?',
        [id]
      );
      return results[0];
    } catch (err) {
      throw err;
    }
  },

  // Create new user with hashed password
  create: async ({ name, email, password, role }) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );
      return { user_id: result.insertId, name, email, role };
    } catch (err) {
      throw err;
    }
  },

  // Compare input password with stored hash
  comparePassword: (inputPassword, storedHash) => {
    return bcrypt.compare(inputPassword, storedHash);
  },

  // ✅ Store reset token and expiry
  updateResetToken: async (id, token, expiry) => {
    try {
      await db.query(
        'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?',
        [token, expiry, id]
      );
    } catch (err) {
      throw err;
    }
  },

  // ✅ Find user by reset token
  findByResetToken: async (token) => {
    try {
      const [results] = await db.query(
        'SELECT * FROM users WHERE reset_token = ?',
        [token]
      );
      return results[0];
    } catch (err) {
      throw err;
    }
  },

  // ✅ Update password
  updatePassword: async (id, hashedPassword) => {
    try {
      await db.query(
        'UPDATE users SET password = ? WHERE user_id = ?',
        [hashedPassword, id]
      );
    } catch (err) {
      throw err;
    }
  },

  // ✅ Clear reset token
  clearResetToken: async (id) => {
    try {
      await db.query(
        'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?',
        [id]
      );
    } catch (err) {
      throw err;
    }
  }
};

module.exports = User;
