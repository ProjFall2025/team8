const db = require('../config/database');

const Property = {
  // Get all properties
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM properties');
    return rows;
  },

  // Get property by ID
  getById: async (id) => {
    const [rows] = await db.query(
      'SELECT * FROM properties WHERE property_id = ?',
      [id]
    );
    return rows[0];
  },

  // Get properties by user
  getByUser: async (user_id) => {
    const [rows] = await db.query(
      'SELECT * FROM properties WHERE user_id = ?',
      [user_id]
    );
    return rows;
  },

  // ✅ Get properties owned by landlord safely
  getByLandlord: async (landlordId) => {
    const [rows] = await db.query(
      `
      SELECT 
        p.property_id,
        p.address,
        p.city,
        p.state,
        p.zip,
        p.rent_amount,
        p.status,

        -- Tenant Count
        (SELECT COUNT(*) 
         FROM leases l 
         WHERE l.property_id = p.property_id) AS tenant_count,

        -- Rent collected
        (SELECT COALESCE(SUM(pay.amount), 0)
         FROM leases l
         LEFT JOIN payments pay 
           ON l.lease_id = pay.lease_id 
          AND pay.status = 'completed'
         WHERE l.property_id = p.property_id) AS rent_collected,

        -- Open requests
        (SELECT COUNT(*) 
         FROM maintenancerequests m 
         WHERE m.property_id = p.property_id 
           AND m.status != 'closed') AS open_requests

      FROM properties p
      WHERE p.user_id = ?
      `,
      [landlordId]
    );
    return rows;
  },

  // ✅ Dashboard view with ownership flag
  getAllWithOwnershipFlag: async (landlordId) => {
    const [rows] = await db.query(
      `
      SELECT 
        p.property_id,
        p.address,
        p.city,
        p.state,
        p.zip,
        p.rent_amount,
        p.status,
        p.user_id AS owner_id,

        CASE WHEN p.user_id = ? THEN 1 ELSE 0 END AS is_owned,

        -- Tenant Count
        (SELECT COUNT(*) 
         FROM leases l 
         WHERE l.property_id = p.property_id) AS tenant_count,

        -- Rent collected
        (SELECT COALESCE(SUM(pay.amount), 0)
         FROM leases l
         LEFT JOIN payments pay 
           ON l.lease_id = pay.lease_id 
          AND pay.status = 'completed'
         WHERE l.property_id = p.property_id) AS rent_collected,

        -- Open requests
        (SELECT COUNT(*) 
         FROM maintenancerequests m 
         WHERE m.property_id = p.property_id 
           AND m.status != 'closed') AS open_requests

      FROM properties p
      `,
      [landlordId]
    );
    return rows;
  },

  // Create new property
  create: async (data) => {
    const {
      address,
      city,
      state,
      zip,
      rent_amount,
      status,
      user_id
    } = data;

    const [result] = await db.query(
      'INSERT INTO properties (address, city, state, zip, rent_amount, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [address, city, state, zip, rent_amount, status, user_id]
    );

    const [newRow] = await db.query(
      'SELECT * FROM properties WHERE property_id = ?',
      [result.insertId]
    );
    return newRow[0];
  },

  // Update property
  update: async (id, data) => {
    const [result] = await db.query(
      'UPDATE properties SET ? WHERE property_id = ?',
      [data, id]
    );
    return result.affectedRows;
  },

  // Delete property
  delete: async (id) => {
    const [result] = await db.query(
      'DELETE FROM properties WHERE property_id = ?',
      [id]
    );
    return result.affectedRows;
  },

  // Count properties grouped by user
  countByUser: async () => {
    const [rows] = await db.query(
      'SELECT user_id, COUNT(*) AS property_count FROM properties GROUP BY user_id'
    );
    return rows;
  }
};

module.exports = Property;