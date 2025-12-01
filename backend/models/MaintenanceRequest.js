const db = require('../config/database');

const MaintenanceRequest = {
  // Get all maintenance requests
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM maintenancerequests');
    return rows;
  },

  // Get request by ID
  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT * FROM maintenancerequests WHERE request_id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Create new request
  create: async (data) => {
    const [result] = await db.query('INSERT INTO maintenancerequests SET ?', [data]);
    return { request_id: result.insertId, ...data };
  },

  // Update request
  update: async (id, data) => {
    const [result] = await db.query(
      'UPDATE maintenancerequests SET ? WHERE request_id = ?',
      [data, id]
    );
    return result.affectedRows ? { request_id: id, ...data } : null;
  },

  // Delete request
  delete: async (id) => {
    const [result] = await db.query(
      'DELETE FROM maintenancerequests WHERE request_id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  // Find requests by user
  findByUser: async (user_id) => {
    const [rows] = await db.query(
      'SELECT * FROM maintenancerequests WHERE user_id = ?',
      [user_id]
    );
    return rows;
  },

  // Find requests by status
  findByStatus: async (status) => {
    const [rows] = await db.query(
      'SELECT * FROM maintenancerequests WHERE status = ?',
      [status]
    );
    return rows;
  },

  // Get requests by landlord
  getByLandlord: async (landlordId) => {
    const [rows] = await db.query(
      `
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
      `,
      [landlordId]
    );
    return rows;
  }
};

module.exports = MaintenanceRequest;