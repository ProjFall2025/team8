const db = require('../config/database');

const LeaseArchive = {
<<<<<<< HEAD
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
=======
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_archives', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findByLease: (leaseId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_archives WHERE lease_id = ?', [leaseId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO lease_archives SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ archive_id: result.insertId, ...data });
      });
    });
  },

  delete: (archiveId) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM lease_archives WHERE archive_id = ?', [archiveId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  }
};

module.exports = LeaseArchive;