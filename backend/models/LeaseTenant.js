const db = require('../config/database');

const LeaseTenant = {
<<<<<<< HEAD
  findAll: async () => {
    try {
      const [results] = await db.query('SELECT * FROM leasetenants');
      console.log('✅ findAll results:', results);
      return results;
    } catch (err) {
      console.error('❌ SQL error in findAll:', err);
      throw err;
    }
  },

  findByLandlord: async (landlordId) => {
  const query = `
    SELECT t.user_id,
           ANY_VALUE(t.name) AS name,
           l.lease_id,
           l.start_date,
           l.end_date,
           ANY_VALUE(p.address) AS address,
           ANY_VALUE(p.city) AS city,
           ANY_VALUE(p.state) AS state,
           l.rent_amount,
           COALESCE(SUM(pay.amount),0) AS rent_collected,
           COALESCE(SUM(CASE WHEN pay.status='pending' THEN pay.amount ELSE 0 END),0) AS balance,
           COALESCE(COUNT(m.request_id),0) AS open_requests
    FROM leases l
    JOIN leasetenants lt ON l.lease_id = lt.lease_id
    JOIN users t ON lt.user_id = t.user_id
    JOIN properties p ON l.property_id = p.property_id
    LEFT JOIN payments pay ON l.lease_id = pay.lease_id
    LEFT JOIN maintenancerequests m ON l.property_id = m.property_id AND m.status='open'
    WHERE p.user_id = ?
    GROUP BY t.user_id, l.lease_id, l.start_date, l.end_date, l.rent_amount;
  `;
  console.log('📡 Running FINAL findByLandlord for landlordId:', landlordId);

  try {
    const [results] = await db.query(query, [landlordId]);
    console.log('✅ findByLandlord results with aggregates:', results);
    return results;
  } catch (err) {
    console.error('❌ SQL error in findByLandlord:', err);
    throw err;
  }
},

  findByLease: async (leaseId) => {
    try {
      const [results] = await db.query('SELECT * FROM leasetenants WHERE lease_id = ?', [leaseId]);
      console.log('✅ findByLease results:', results);
      return results;
    } catch (err) {
      console.error('❌ SQL error in findByLease:', err);
      throw err;
    }
  },

  findByUser: async (userId) => {
    try {
      const [results] = await db.query('SELECT * FROM leasetenants WHERE user_id = ?', [userId]);
      console.log('✅ findByUser results:', results);
      return results;
    } catch (err) {
      console.error('❌ SQL error in findByUser:', err);
      throw err;
    }
  },

  addTenant: async (data) => {
    try {
      await db.query('INSERT INTO leasetenants SET ?', data);
      const [results] = await db.query('SELECT * FROM leasetenants WHERE lease_id = ?', [data.lease_id]);
      console.log('✅ addTenant results:', results);
      return results;
    } catch (err) {
      console.error('❌ SQL error in addTenant:', err);
      throw err;
    }
  },

  removeTenant: async (data) => {
    try {
      const [result] = await db.query(
        'DELETE FROM leasetenants WHERE lease_id = ? AND user_id = ?',
        [data.lease_id, data.user_id]
      );
      console.log('✅ removeTenant affectedRows:', result.affectedRows);
      return result.affectedRows > 0;
    } catch (err) {
      console.error('❌ SQL error in removeTenant:', err);
      throw err;
    }
=======
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_tenants', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findByLease: (leaseId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_tenants WHERE lease_id = ?', [leaseId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_tenants WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  addTenant: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO lease_tenants SET ?', data, (err, result) => {
        if (err) return reject(err);
        db.query('SELECT * FROM lease_tenants WHERE lease_id = ?', [data.lease_id], (err2, results) => {
          if (err2) return reject(err2);
          resolve(results);
        });
      });
    });
  },

  removeTenant: (data) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM lease_tenants WHERE lease_id = ? AND user_id = ?', [data.lease_id, data.user_id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  }
};

module.exports = LeaseTenant;