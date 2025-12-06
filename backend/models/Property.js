const db = require('../config/database');

const Property = {
  // Get all properties (Admin/Tenant View)
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

  // Get properties by user (General lookup)
  getByUser: async (user_id) => {
    const [rows] = await db.query(
      'SELECT * FROM properties WHERE user_id = ?',
      [user_id]
    );
    return rows;
  },

 // ✅ FIXED: Get properties owned by landlord (Landlord Dashboard List)
  getByLandlord: async (landlordId) => {
    const query = `
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
    `.trim(); // Ensure this is the last line before the closing backtick

    const [rows] = await db.query(query, [landlordId]);
    return rows;
  },

  // ✅ FIXED: Dashboard view with ownership flag
  getAllWithOwnershipFlag: async (landlordId) => {
    const query = `
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
    `.trim(); // Ensure this is the last line before the closing backtick

    const [rows] = await db.query(query, [landlordId]);
    return rows;
  },
  // Create new property (No change)
  create: async (data) => {
    // Dynamically build fields and placeholders
    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const [result] = await db.query(
      `INSERT INTO properties (${fields}) VALUES (${placeholders})`,
      values
    );

    const [newRow] = await db.query(
      'SELECT * FROM properties WHERE property_id = ?',
      [result.insertId]
    );
    return newRow[0];
  },

  // 🛑 IMPROVED: Update property using dynamic parameterized query
  update: async (id, data) => {
    // Build dynamic SET clause
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    
    const [result] = await db.query(
      `UPDATE properties SET ${fields} WHERE property_id = ?`,
      [...values, id] // Pass all values, including the ID last
    );
    return result.affectedRows;
  },

  // Delete property (No change needed here, the controller handles cascade)
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