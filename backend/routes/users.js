const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const db = require('../config/database');

<<<<<<< HEAD
// List users (admins see all, landlords see only their tenants)
router.get('/', verifyToken, roleMiddleware('admin', 'landlord'), async (req, res) => {
  const { role } = req.query;
  try {
    let query = 'SELECT user_id AS id, email, phone, mobile_number, role, created_at FROM users';
    let values = [];

    if (req.user.role === 'landlord') {
      query += ' WHERE landlord_id = ?';
      values.push(req.user.user_id);
    } else if (role) {
      query += ' WHERE role = ?';
      values.push(role);
    }

    const [rows] = await db.query(query, values);
    res.json(rows);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
router.patch('/:id', verifyToken, roleMiddleware('admin', 'landlord'), async (req, res) => {
=======
const getUserById = (req, res) => {
  const userId = req.params.id;
  res.json({ message: `User ${userId} fetched` });
};

const deleteUser = (req, res) => {
  res.json({ message: `User ${req.params.id} deleted` });
};

const updateUser = async (req, res) => {
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  const userId = req.params.id;
  const fields = req.body;

  const updates = [];
  const values = [];

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update' });
  }

<<<<<<< HEAD
  values.push(userId);
=======
  values.push(userId); // for WHERE clause
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0

  const query = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`;

  try {
    const [result] = await db.query(query, values);
<<<<<<< HEAD
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
=======

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
    res.json({ message: `User ${userId} updated successfully` });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
<<<<<<< HEAD
});

// Delete user
router.delete('/:id', verifyToken, roleMiddleware('admin', 'landlord'), async (req, res) => {
  const userId = req.params.id;

  try {
    // Step 1: Delete lease-related dependencies first
    await db.query('DELETE FROM leasetenants WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM leasearchive WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM leasephotos WHERE uploaded_by = ?', [userId]);
    await db.query('DELETE FROM leases WHERE user_id = ?', [userId]);

    // Step 2: Delete other dependencies
    await db.query('DELETE FROM maintenancerequests WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM payments WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM properties WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM smartpasscodes WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM tenanthistory WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM userids WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM userreminders WHERE user_id = ?', [userId]);

    // Step 3: Delete the user
    const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: `✅ User ${userId} deleted successfully` });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
=======
};

router.get('/:id', verifyToken, getUserById);
router.patch('/:id', verifyToken, roleMiddleware('admin'), updateUser);
router.delete('/:id', verifyToken, roleMiddleware('admin'), deleteUser);
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0

module.exports = router;