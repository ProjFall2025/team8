const db = require('../config/database');

const LeaseRequest = {
  create: async ({ user_id, property_id }) => {
    const [result] = await db.query(
      'INSERT INTO lease_requests (user_id, property_id, status, requested_at) VALUES (?, ?, ?, ?)',
      [user_id, property_id, 'pending', new Date()]
    );

    return {
      request_id: result.insertId,
      user_id,
      property_id,
      status: 'pending',
      requested_at: new Date()
    };
  },

  findByUserId: async (user_id) => {
    const [results] = await db.query(
      `SELECT lr.request_id, lr.user_id, lr.property_id, lr.status, lr.requested_at,
              p.address, p.rent_amount, p.status AS property_status
       FROM lease_requests lr
       JOIN properties p ON lr.property_id = p.property_id
       WHERE lr.user_id = ?`,
      [user_id]
    );
    return results;
  },

  findPending: async () => {
    const [results] = await db.query(
      `SELECT lr.request_id, lr.user_id, lr.property_id, lr.status, lr.requested_at,
              p.address, p.rent_amount, p.status AS property_status
       FROM lease_requests lr
       JOIN properties p ON lr.property_id = p.property_id
       WHERE lr.status = "pending"`
    );
    return results;
  },

  updateStatus: async (request_id, status) => {
    await db.query(
      'UPDATE lease_requests SET status = ? WHERE request_id = ?',
      [status, request_id]
    );
    return { request_id, status };
  }
};

module.exports = LeaseRequest;