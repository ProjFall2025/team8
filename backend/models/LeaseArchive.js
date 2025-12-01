const db = require('../config/database');

const LeaseArchive = {
  // Get all archived leases
  findAll: async () => {
    try {
      const [results] = await db.query('SELECT * FROM leasearchive');
      return results;
    } catch (err) {
      throw err;
    }
  },

  // Get archived leases by lease ID
  findByLease: async (leaseId) => {
    try {
      const [results] = await db.query(
        'SELECT * FROM leasearchive WHERE lease_id = ?',
        [leaseId]
      );
      return results;
    } catch (err) {
      throw err;
    }
  },

  // Create a new archive record
  create: async (data) => {
    try {
      const [result] = await db.query('INSERT INTO leasearchive SET ?', data);
      return { archive_id: result.insertId, ...data };
    } catch (err) {
      throw err;
    }
  },

  // Delete an archive record by ID
  delete: async (archiveId) => {
    try {
      const [result] = await db.query(
        'DELETE FROM leasearchive WHERE archive_id = ?',
        [archiveId]
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw err;
    }
  }
};

module.exports = LeaseArchive;