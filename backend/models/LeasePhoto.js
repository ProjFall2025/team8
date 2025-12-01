const db = require('../config/database');

const LeasePhoto = {
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
  }
};

module.exports = LeasePhoto;