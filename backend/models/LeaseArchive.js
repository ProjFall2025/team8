const db = require('../config/database');

const LeaseArchive = {
  findAll: async () => {
    try {
      const [results] = await db.query('SELECT * FROM leasearchive');
      return results;
    } catch (err) {
      throw err;
    }
  },

  findByLease: async (leaseId) => {
    try {
      const [results] = await db.query('SELECT * FROM leasearchive WHERE lease_id = ?', [leaseId]);
      return results;
    } catch (err) {
      throw err;
    }
  },

  create: async (data) => {
    try {
      const [result] = await db.query('INSERT INTO leasearchive SET ?', data);
      return { archive_id: result.insertId, ...data };
    } catch (err) {
      throw err;
    }
  },

  delete: async (archiveId) => {
    try {
      const [result] = await db.query('DELETE FROM leasearchive WHERE archive_id = ?', [archiveId]);
      return result.affectedRows > 0;
    } catch (err) {
      throw err;
    }
  }
};

module.exports = LeaseArchive;