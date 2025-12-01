<<<<<<< HEAD
const db = require('../config/database');

const Property = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM properties');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM properties WHERE property_id = ?', [id]);
    return rows[0];
  },

  getByUser: async (user_id) => {
    const [rows] = await db.query('SELECT * FROM properties WHERE user_id = ?', [user_id]);
    return rows;
  },

  // ✅ FIXED: Get properties owned by landlord safely
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

  // ✅ FIXED: Dashboard view with ownership flag
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

    const [newRow] = await db.query('SELECT * FROM properties WHERE property_id = ?', [result.insertId]);
    return newRow[0];
  },

  update: async (id, data) => {
    const [result] = await db.query('UPDATE properties SET ? WHERE property_id = ?', [data, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM properties WHERE property_id = ?', [id]);
    return result.affectedRows;
  },

  countByUser: async () => {
    const [rows] = await db.query(
      'SELECT user_id, COUNT(*) AS property_count FROM properties GROUP BY user_id'
    );
    return rows;
  }
};

module.exports = Property;
=======
const Property = require('../models/Property');

const propertyController = {
  getAll: async (req, res) => {
    try {
      const properties = await Property.findAll();
      res.status(200).json(properties);
    } catch {
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  },

  getById: async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).json({ error: 'Property not found' });
      res.status(200).json(property);
    } catch {
      res.status(500).json({ error: 'Failed to fetch property' });
    }
  },

  create: async (req, res) => {
    try {
      const newProperty = await Property.create(req.body);
      res.status(201).json(newProperty);
    } catch {
      res.status(500).json({ error: 'Failed to create property' });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await Property.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Property not found' });
      res.status(200).json({ message: 'Property updated successfully' });
    } catch {
      res.status(500).json({ error: 'Failed to update property' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await Property.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Property not found' });
      res.status(200).json({ message: 'Property deleted successfully' });
    } catch {
      res.status(500).json({ error: 'Failed to delete property' });
    }
  }
};

module.exports = propertyController;
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
