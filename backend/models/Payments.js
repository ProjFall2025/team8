const db = require('../config/database');

const Payments = {
<<<<<<< HEAD
  findAll: async () => {
    const [results] = await db.query(`
      SELECT 
        p.payment_id,
        p.amount,
        p.paid_date,
        p.status,
        p.payment_type,
        p.payment_for_month,
        u.user_id,
        u.name AS tenant_name,
        u.email AS tenant_email,
        pr.property_id,
        pr.address AS property_address,
        pr.city,
        pr.state,
        pr.zip,
        pr.rent_amount,
        pr.status AS property_status
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.user_id
      LEFT JOIN leases l ON p.lease_id = l.lease_id
      LEFT JOIN properties pr ON l.property_id = pr.property_id
      ORDER BY p.paid_date DESC
    `);
    return results;
  },

  findById: async (id) => {
    const [results] = await db.query('SELECT * FROM payments WHERE payment_id = ?', [id]);
    return results[0];
  },

  findByUser: async (userId) => {
    const [results] = await db.query('SELECT * FROM payments WHERE user_id = ?', [userId]);
    return results;
  },

  findByLease: async (leaseId) => {
    const [results] = await db.query('SELECT * FROM payments WHERE lease_id = ?', [leaseId]);
    return results;
  },

  // 🔍 NEW: Find payments by landlord
// models/Payments.js
findByLandlord: async (landlordId) => {
  const [results] = await db.query(`
    SELECT 
      l.lease_id,
      ANY_VALUE(pr.property_id) AS property_id,
      ANY_VALUE(pr.address) AS property_address,
      ANY_VALUE(pr.city) AS city,
      ANY_VALUE(pr.state) AS state,
      ANY_VALUE(pr.zip) AS zip,
      ANY_VALUE(pr.rent_amount) AS rent_amount,
      GROUP_CONCAT(DISTINCT u.name SEPARATOR ', ') AS tenant_names,
      DATE_FORMAT(p.payment_for_month, '%Y-%m') AS payment_month,
      SUM(p.amount) AS total_paid,
      MAX(p.paid_date) AS last_paid_date,
      MAX(p.status) AS latest_status
    FROM payments p
    JOIN leases l ON p.lease_id = l.lease_id
    JOIN properties pr ON l.property_id = pr.property_id
    JOIN users u ON p.user_id = u.user_id
    WHERE pr.user_id = ?
    GROUP BY l.lease_id, payment_month
    ORDER BY payment_month DESC
  `, [landlordId]);

  return results;
},
  create: async (data) => {
    console.log('📥 Model: create triggered');
    console.log('🧾 Payload:', data);
    const [result] = await db.query('INSERT INTO payments SET ?', data);
    console.log('✅ DB insert result:', result);
    return { payment_id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const [result] = await db.query('UPDATE payments SET ? WHERE payment_id = ?', [data, id]);
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM payments WHERE payment_id = ?', [id]);
    return result.affectedRows > 0;
=======
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM payments', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM payments WHERE payment_id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  findByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM payments WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findByLease: (leaseId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM payments WHERE lease_id = ?', [leaseId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO payments SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ payment_id: result.insertId, ...data });
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM payments WHERE payment_id = ?', [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  }
};

module.exports = Payments;