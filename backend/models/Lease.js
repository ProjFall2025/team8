const db = require('../config/database');

const Lease = {
<<<<<<< HEAD
  // Get all leases
  findAll: async () => {
  try {
    const [results] = await db.query(`
      SELECT 
        l.lease_id,
        l.start_date,
        l.end_date,
        l.rent_amount,
        l.renewal_requested, -- ✅ status proxy
        l.lease_file_url,
        u.user_id,
        u.name AS tenant_name,
        u.email AS tenant_email,
        p.property_id,
        p.address AS property_address,
        p.city,
        p.state,
        p.zip,
        p.status AS property_status
      FROM leases l
      LEFT JOIN users u ON l.user_id = u.user_id
      LEFT JOIN properties p ON l.property_id = p.property_id
      ORDER BY l.start_date DESC
    `);
    return results;
  } catch (err) {
    console.error('❌ Lease.findAll error:', err);
    throw err;
  }
},
  // Get lease by ID
  findById: async (id) => {
    try {
      const [results] = await db.query(
        'SELECT * FROM leases WHERE lease_id = ?',
        [id]
      );
      return results[0];
    } catch (err) {
      console.error(`❌ Lease.findById(${id}) error:`, err);
      throw err;
    }
  },

  // Create new lease
  create: async (data) => {
    try {
      console.log('🚀 Lease.create received:', data);

      const fields = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);

      const [result] = await db.query(
        `INSERT INTO leases (${fields}) VALUES (${placeholders})`,
        values
      );

      console.log('✅ Lease.create result:', result);
      return { lease_id: result.insertId, ...data };
    } catch (err) {
      console.error('❌ Lease.create error:', err);
      throw err;
    }
  },

  // Update lease
  update: async (id, data) => {
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);

      const [result] = await db.query(
        `UPDATE leases SET ${fields} WHERE lease_id = ?`,
        [...values, id]
      );

      return result.affectedRows ? { lease_id: id, ...data } : null;
    } catch (err) {
      console.error(`❌ Lease.update(${id}) error:`, err);
      throw err;
    }
  },

  // Delete lease
  delete: async (id) => {
    try {
      const [result] = await db.query(
        'DELETE FROM leases WHERE lease_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error(`❌ Lease.delete(${id}) error:`, err);
      throw err;
    }
=======
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM leases', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM leases WHERE lease_id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO leases SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ lease_id: result.insertId, ...data });
      });
    });
  },

  update: (id, data) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE leases SET ? WHERE lease_id = ?', [data, id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows ? { lease_id: id, ...data } : null);
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM leases WHERE lease_id = ?', [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  }
};

module.exports = Lease;