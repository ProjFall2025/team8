const db = require('../config/database');

const MaintenanceRequest = {
<<<<<<< HEAD
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM maintenancerequests');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM maintenancerequests WHERE request_id = ?', [id]);
    return rows[0] || null;
  },

  create: async (data) => {
    const [result] = await db.query('INSERT INTO maintenancerequests SET ?', [data]);
    return { request_id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const [result] = await db.query('UPDATE maintenancerequests SET ? WHERE request_id = ?', [data, id]);
    return result.affectedRows ? { request_id: id, ...data } : null;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM maintenancerequests WHERE request_id = ?', [id]);
    return result.affectedRows > 0;
  },

  findByUser: async (user_id) => {
    const [rows] = await db.query('SELECT * FROM maintenancerequests WHERE user_id = ?', [user_id]);
    return rows;
  },

  findByStatus: async (status) => {
    const [rows] = await db.query('SELECT * FROM maintenancerequests WHERE status = ?', [status]);
    return rows;
  },

  getByLandlord: async (landlordId) => {
  const [rows] = await db.query(`
    SELECT mr.request_id,
           mr.property_id,
           mr.description,
           mr.status,
           mr.created_at,
           u.name AS tenant_name,
           u.user_id,
           p.address,
           p.city,
           p.state
    FROM maintenancerequests mr
    JOIN properties p ON mr.property_id = p.property_id
    JOIN users u ON mr.user_id = u.user_id
    WHERE p.user_id = ?
    ORDER BY mr.created_at DESC;
  `, [landlordId]);
  return rows;
}
=======
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM maintenance_requests', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM maintenance_requests WHERE request_id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO maintenance_requests SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ request_id: result.insertId, ...data });
      });
    });
  },

  update: (id, data) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE maintenance_requests SET ? WHERE request_id = ?', [data, id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows ? { request_id: id, ...data } : null);
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM maintenance_requests WHERE request_id = ?', [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
};

module.exports = MaintenanceRequest;