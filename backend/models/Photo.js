const db = require('../config/database');

const Photo = {
  // Get all photos
  findAll: async () => {
    const [results] = await db.query('SELECT * FROM photos');
    return results;
  },

  // Get photos by user
  findByUser: async (userId) => {
    const [results] = await db.query(
      'SELECT * FROM photos WHERE user_id = ?',
      [userId]
    );
    return results;
  },

  // Create new photo
  create: async (data) => {
    const [result] = await db.query('INSERT INTO photos SET ?', data);
    return { photo_id: result.insertId, ...data };
  },

  // Delete photo
  delete: async (photoId) => {
    const [result] = await db.query(
      'DELETE FROM photos WHERE photo_id = ?',
      [photoId]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Photo;