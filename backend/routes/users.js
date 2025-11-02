const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const db = require('../config/database');

const getUserById = (req, res) => {
  const userId = req.params.id;
  res.json({ message: `User ${userId} fetched` });
};

const deleteUser = (req, res) => {
  res.json({ message: `User ${req.params.id} deleted` });
};

const updateUser = async (req, res) => {
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

  values.push(userId); // for WHERE clause

  const query = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`;

  try {
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: `User ${userId} updated successfully` });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.get('/:id', verifyToken, getUserById);
router.patch('/:id', verifyToken, roleMiddleware('admin'), updateUser);
router.delete('/:id', verifyToken, roleMiddleware('admin'), deleteUser);

module.exports = router;