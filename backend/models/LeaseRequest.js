const db = require('../config/database');

const LeaseRequest = {
  create: async ({ user_id }) => {
    const [result] = await db.query(
      'INSERT INTO lease_requests (user_id, status, requested_at) VALUES (?, ?, ?)',
      [user_id, 'pending', new Date()]
    );
    return {
      request_id: result.insertId,
      user_id,
      status: 'pending',
      requested_at: new Date()
    };
  },

  findByUserId: async (user_id) => {
    const [results] = await db.query(
      'SELECT request_id, user_id, status, requested_at FROM lease_requests WHERE user_id = ?',
      [user_id]
    );
    return results;
  },

  findPending: async () => {
    const [results] = await db.query(
      'SELECT request_id, user_id, status, requested_at FROM lease_requests WHERE status = "pending"'
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