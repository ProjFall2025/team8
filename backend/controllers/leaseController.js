const db = require('../config/database');

const leaseController = {
  // ✅ GET all leases with tenant info
  getAll: async (req, res) => {
    try {
      let query = `
      SELECT 
        l.lease_id,
        l.start_date,
        l.end_date,
        l.rent_amount,
        l.renewal_requested, -- ✅ using existing column
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
    `;
      let values = [];

      if (req.user.role === 'landlord') {
        query += ' WHERE u.user_id = ?';
        values.push(req.user.user_id);
      }

      const [rows] = await db.query(query, values);
      console.log('📦 Lease query result:', rows);
      res.json(rows);
    } catch (err) {
      console.error('❌ Fetch leases error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // ✅ GET lease by ID
  getById: async (req, res) => {
    const leaseId = req.params.id;
    console.log(`📡 GET /api/leases/${leaseId} triggered`);

    try {
      const [rows] = await db.query('SELECT * FROM leases WHERE lease_id = ?', [leaseId]);
      if (!rows || rows.length === 0) {
        console.warn(`⚠️ Lease ${leaseId} not found`);
        return res.status(404).json({ error: 'Lease not found' });
      }
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error(`❌ Lease.getById(${leaseId}) error:`, err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ✅ CREATE new lease
  create: async (req, res) => {
    const { property_id, user_id, start_date, end_date, rent_amount } = req.body;
    console.log('📥 Incoming lease data:', req.body);

    try {
      const [result] = await db.query(
        'INSERT INTO leases (property_id, user_id, start_date, end_date, rent_amount) VALUES (?, ?, ?, ?, ?)',
        [property_id, user_id, start_date, end_date, rent_amount]
      );

      const newLease = { lease_id: result.insertId, property_id, user_id, start_date, end_date, rent_amount };
      console.log('✅ Lease created:', newLease);
      res.status(201).json(newLease);
    } catch (err) {
      console.error('❌ Lease creation error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ✅ UPDATE lease (fixed for mysql2/promise)
  update: async (req, res) => {
    const leaseId = req.params.id;
    const updates = req.body;
    console.log(`✏️ Updating lease ${leaseId} with`, updates);

    try {
      // Build dynamic SET clause
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);

      const [result] = await db.query(
        `UPDATE leases SET ${fields} WHERE lease_id = ?`,
        [...values, leaseId]
      );

      if (result.affectedRows === 0) {
        console.warn(`⚠️ Lease ${leaseId} not found for update`);
        return res.status(404).json({ error: 'Lease not found' });
      }
      res.status(200).json({ lease_id: leaseId, ...updates });
    } catch (err) {
      console.error(`❌ Lease.update(${leaseId}) error:`, err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ✅ DELETE lease
  delete: async (req, res) => {
    const leaseId = req.params.id;
    console.log(`🗑️ Deleting lease ${leaseId}`);

    try {
      const [result] = await db.query('DELETE FROM leases WHERE lease_id = ?', [leaseId]);
      if (result.affectedRows === 0) {
        console.warn(`⚠️ Lease ${leaseId} not found for deletion`);
        return res.status(404).json({ error: 'Lease not found' });
      }
      res.status(200).json({ message: 'Lease deleted successfully' });
    } catch (err) {
      console.error(`❌ Lease.delete(${leaseId}) error:`, err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ✅ GET lease by user_id
  getLeaseByUser: async (req, res) => {
    const userId = req.params.user_id;
    console.log(`🔍 Fetching lease for user_id: ${userId}`);

    try {
      const query = `
        SELECT lease_id, property_id, start_date, end_date,
       lease_file_url, renewal_requested, renewal_date, rent_amount
FROM leases
WHERE user_id = ?
LIMIT 1
      `;
      const [rows] = await db.query(query, [userId]);
      console.log('📦 Lease query result:', rows);

      if (!rows || rows.length === 0) {
        console.warn(`⚠️ No lease found for user_id: ${userId}`);
        return res.status(404).json({ error: 'Lease not found' });
      }

      console.log("📤 Sending lease response:", rows[0]);
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error('❌ Lease fetch error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ✅ Upload lease file and archive old one
  uploadFile: async (req, res) => {
    const leaseId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const newFileUrl = `/files/${req.file.filename}`;

    try {
      const [rows] = await db.query('SELECT * FROM leases WHERE lease_id = ?', [leaseId]);
      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: 'Lease not found' });
      }

      const currentLease = rows[0];

      // Archive old file if exists
      if (currentLease.lease_file_url) {
        await db.query(
          `INSERT INTO leasearchive 
           (lease_id, user_id, lease_pdf_url, archived_at)
           VALUES (?, ?, ?, NOW())`,
          [currentLease.lease_id, currentLease.user_id, currentLease.lease_file_url]
        );
      }

      await db.query('UPDATE leases SET lease_file_url = ? WHERE lease_id = ?', [newFileUrl, leaseId]);

      res.status(200).json({ lease_id: leaseId, lease_file_url: newFileUrl });
    } catch (err) {
      console.error('❌ File upload error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = leaseController;