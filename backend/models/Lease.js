const db = require('../config/database');

const Lease = {
  // Get all leases (No change)
  findAll: async () => {
    try {
      const [results] = await db.query(`
        SELECT 
          l.lease_id,
          l.start_date,
          l.end_date,
          l.rent_amount,
          l.renewal_requested,
          l.lease_file_url,
          u.user_id,
          u.name AS tenant_name,
          u.email AS tenant_email,
          p.property_id,
          p.address AS property_address,
          p.city,
          p.state,
          p.zip,
          p.status AS property_status
        FROM leases l
        LEFT JOIN users u ON l.user_id = u.user_id
        LEFT JOIN properties p ON l.property_id = p.property_id
        ORDER BY l.start_date DESC
      `);
      return results;
    } catch (err) {
      console.error('❌ Lease.findAll error:', err);
      throw err;
    }
  },

  // 1. ✅ NEW METHOD: Get leases filtered by the Landlord's Property Ownership ID
  findByLandlord: async (landlordId) => {
    try {
      const [results] = await db.query(`
        SELECT 
          l.lease_id,
          l.start_date,
          l.end_date,
          l.rent_amount,
          l.renewal_requested,
          l.lease_file_url,
          u.user_id,
          u.name AS tenant_name,
          u.email AS tenant_email,
          p.property_id,
          p.address AS property_address,
          p.city,
          p.state,
          p.zip
        FROM leases l
        LEFT JOIN users u ON l.user_id = u.user_id
        LEFT JOIN properties p ON l.property_id = p.property_id
        WHERE p.user_id = ?  -- 🛑 Crucial filter: Only leases on properties owned by this user
        ORDER BY l.start_date DESC
      `,
        [landlordId]
      );
      return results;
    } catch (err) {
      console.error(`❌ Lease.findByLandlord(${landlordId}) error:`, err);
      throw err;
    }
  },

  // Get lease by ID (No change)
  findById: async (id) => {
    try {
      const [results] = await db.query(
        'SELECT * FROM leases WHERE lease_id = ?',
        [id]
      );
      return results[0];
    } catch (err) {
      console.error(`❌ Lease.findById(${id}) error:`, err);
      throw err;
    }
  },

  // Create new lease (No change)
  create: async (data) => {
    try {
      console.log('🚀 Lease.create received:', data);

      const fields = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);

      const [result] = await db.query(
        `INSERT INTO leases (${fields}) VALUES (${placeholders})`,
        values
      );

      console.log('✅ Lease.create result:', result);
      return { lease_id: result.insertId, ...data };
    } catch (err) {
      console.error('❌ Lease.create error:', err);
      throw err;
    }
  },

  // Update lease (No change)
  update: async (id, data) => {
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = Object.values(data);

      const [result] = await db.query(
        `UPDATE leases SET ${fields} WHERE lease_id = ?`,
        [...values, id]
      );

      return result.affectedRows ? { lease_id: id, ...data } : null;
    } catch (err) {
      console.error(`❌ Lease.update(${id}) error:`, err);
      throw err;
    }
  },

  // Delete lease (No change)
  delete: async (id) => {
    try {
      const [result] = await db.query(
        'DELETE FROM leases WHERE lease_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error(`❌ Lease.delete(${id}) error:`, err);
      throw err;
    }
  },

  // 2. ✅ NEW METHOD: Delete leases associated with a specific property ID
  deleteByPropertyId: async (propertyId) => {
    try {
      const [result] = await db.query(
        'DELETE FROM leases WHERE property_id = ?',
        [propertyId]
      );
      return result.affectedRows; // Return count of deleted rows
    } catch (err) {
      console.error(`❌ Lease.deleteByPropertyId(${propertyId}) error:`, err);
      throw err;
    }
  }
};

module.exports = Lease;