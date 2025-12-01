const db = require('../config/database');

const LeasePhoto = {
<<<<<<< HEAD
  // Get all photos
  findAll: async () => {
    const [results] = await db.query('SELECT * FROM leasephotos');
    return results;
  },

  // Get photos by lease
  findByLease: async (leaseId) => {
    const [results] = await db.query(
      'SELECT * FROM leasephotos WHERE lease_id = ?',
      [leaseId]
    );
    return results;
  },

  // Create new photo
  create: async (data) => {
    const [result] = await db.query('INSERT INTO leasephotos SET ?', data);
    return { photo_id: result.insertId, ...data };
  },

  // Delete photo
  delete: async (photoId) => {
    const [result] = await db.query(
      'DELETE FROM leasephotos WHERE photo_id = ?',
      [photoId]
    );
    return result.affectedRows > 0;
  },

  // Update visibility flag
  updateVisibility: async (photoId, visible) => {
    const [result] = await db.query(
      'UPDATE leasephotos SET is_visible_to_tenant = ? WHERE photo_id = ?',
      [visible, photoId]
    );
    return result;
=======
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_photos', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findByLease: (leaseId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM lease_photos WHERE lease_id = ?', [leaseId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  create: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO lease_photos SET ?', data, (err, result) => {
        if (err) return reject(err);
        resolve({ photo_id: result.insertId, ...data });
      });
    });
  },

  delete: (photoId) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM lease_photos WHERE photo_id = ?', [photoId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  }
};

module.exports = LeasePhoto;