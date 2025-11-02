const db = require('../config/database');
const bcrypt = require('bcrypt');

const User = {
  findByEmail: async (email) => {
    try {
      const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      return results[0];
    } catch (err) {
      throw err;
    }
  },

  findById: async (id) => {
    try {
      const [results] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
      return results[0];
    } catch (err) {
      throw err;
    }
  },

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

  comparePassword: (inputPassword, storedHash) => {
    return bcrypt.compare(inputPassword, storedHash);
  }
};

module.exports = User;