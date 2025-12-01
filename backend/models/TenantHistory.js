const db = require('../config/database');

const TenantHistory = {
<<<<<<< HEAD
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
=======
  findByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tenant_history WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO tenant_history SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ history_id: result.insertId, ...data });
      });
    });
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  }
};

module.exports = TenantHistory;