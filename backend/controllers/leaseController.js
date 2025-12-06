const db = require('../config/database');
// 1. ✅ IMPORT THE LEASE MODEL
const Lease = require('../models/Lease'); 

const leaseController = {
  // ✅ GET all leases (NOW ADMIN ONLY - calls model's findAll)
  getAll: async (req, res) => {
    try {
      // This now simply calls the model method for ALL leases. 
      // Access should be restricted by the router middleware to 'admin' only.
      const rows = await Lease.findAll(); 
      console.log('📦 Lease query result (Admin):', rows);
      res.json(rows);
    } catch (err) {
      console.error('❌ Fetch leases error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  // 2. ✅ NEW SECURE FUNCTION FOR LANDLORD
  getByLandlord: async (req, res) => {
    const landlordId = req.params.landlordId; // ID from the URL

    // Critical Security Check: Ensure the token user matches the requested ID
    if (req.user.user_id.toString() !== landlordId) {
        return res.status(403).json({ error: 'Unauthorized to view these leases' });
    }

    try {
      // Use the secure model method to get only the landlord's properties' leases
      const rows = await Lease.findByLandlord(landlordId);
      console.log(`📦 Landlord Leases for ID ${landlordId}:`, rows);
      res.json(rows);
    } catch (err) {
      console.error(`❌ Fetch landlord leases error for ID ${landlordId}:`, err);
      res.status(500).json({ error: 'Failed to fetch landlord leases' });
    }
  },

  // ✅ GET lease by ID (remains the same)
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

  // ✅ CREATE new lease (remains the same)
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

  // ✅ UPDATE lease (remains the same)
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

  // ✅ DELETE lease (remains the same)
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

  // ✅ GET lease by user_id (FIXED INDENTATION)
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
`.trim(); // <-- Left-aligned and using .trim()

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

  // ✅ Upload lease file and archive old one (FIXED INDENTATION)
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
        await db.query(`
INSERT INTO leasearchive
(lease_id, user_id, lease_pdf_url, archived_at)
VALUES (?, ?, ?, NOW())
`.trim(), // <-- FIX APPLIED HERE: Left-aligned and using .trim()
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