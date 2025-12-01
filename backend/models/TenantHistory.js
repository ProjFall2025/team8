const db = require('../config/database');

const TenantHistory = {
  // Get all tenant history records
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM tenanthistory');
    return rows;
  },

  // Get tenant history by lease
  getByLease: async (lease_id) => {
    const [rows] = await db.query(
      'SELECT * FROM tenanthistory WHERE lease_id = ?',
      [lease_id]
    );
    return rows;
  },

  // Get tenant history by user
  findByUser: async (userId) => {
    const [rows] = await db.query(
      'SELECT * FROM tenanthistory WHERE user_id = ?',
      [userId]
    );
    return rows;
  },

  // Create new tenant history record
  create: async (data) => {
    const { lease_id, user_id, activity_type } = data;

    const [result] = await db.query(
      'INSERT INTO tenanthistory (lease_id, user_id, activity_type) VALUES (?, ?, ?)',
      [lease_id, user_id, activity_type]
    );

    const [newRow] = await db.query(
      'SELECT * FROM tenanthistory WHERE history_id = ?',
      [result.insertId]
    );
    return newRow[0];
  },

  // Update tenant history record
  update: async (id, data) => {
    const [result] = await db.query(
      'UPDATE tenanthistory SET ? WHERE history_id = ?',
      [data, id]
    );
    return result.affectedRows;
  },

  // Delete tenant history record
  delete: async (id) => {
    const [result] = await db.query(
      'DELETE FROM tenanthistory WHERE history_id = ?',
      [id]
    );
    return result.affectedRows;
  }
};

module.exports = TenantHistory;