const db = require('../config/database');

const TenantHistory = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM tenanthistory');
    return rows;
  },

  getByLease: async (lease_id) => {
    const [rows] = await db.query(
      'SELECT * FROM tenanthistory WHERE lease_id = ?',
      [lease_id]
    );
    return rows;
  },

  create: async (data) => {
    const { lease_id, user_id, activity_type } = data;

    const [result] = await db.query(
      'INSERT INTO tenanthistory (lease_id, user_id, activity_type) VALUES (?, ?, ?)',
      [lease_id, user_id, activity_type]
    );

    const [newRow] = await db.query('SELECT * FROM tenanthistory WHERE history_id = ?', [result.insertId]);
    return newRow[0];
  },

  update: async (id, data) => {
    const [result] = await db.query('UPDATE tenanthistory SET ? WHERE history_id = ?', [data, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM tenanthistory WHERE history_id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = TenantHistory;