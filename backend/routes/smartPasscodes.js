const express = require('express');
const router = express.Router();
<<<<<<< HEAD

const smartPasscodeController = require('../controllers/smartPasscodeController');
const auth = require('../middlewares/auth');
const db = require('../config/database');

/**
 * ---------------------------------------------------------------------
 * FIXED ROUTES (Must come BEFORE parameterized routes)
 * ---------------------------------------------------------------------
 */

// Get all users that have active leases
router.get('/users-with-leases', auth, async (req, res) => {
  try {
    const query = `
      SELECT 
        u.user_id, 
        u.name, 
        u.email, 
        l.lease_id
      FROM users u
      INNER JOIN leases l 
        ON u.user_id = l.user_id
    `;

    const [rows] = await db.query(query);
    return res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching users-with-leases:', err);
    return res.status(500).json({
      error: 'Internal server error while fetching users with leases',
    });
  }
});

// Validate Passcode
router.post('/validate', auth, smartPasscodeController.validate);

// Regenerate Passcode
router.post('/regenerate', auth, smartPasscodeController.regenerate);


/**
 * ---------------------------------------------------------------------
 * PARAMETER ROUTES (Must always be last)
 * ---------------------------------------------------------------------
 */

// Get passcode by lease ID
router.get('/:lease_id', auth, smartPasscodeController.getByLease);

// Create new smart passcode
router.post('/', auth, smartPasscodeController.create);

// Delete passcode by ID
router.delete('/:passcode_id', auth, smartPasscodeController.delete);

// Revoke passcode by ID
router.patch('/:passcode_id/revoke', auth, smartPasscodeController.revoke);


module.exports = router;
=======
const smartPasscodeController = require('../controllers/smartPasscodeController');
const auth = require('../middlewares/auth');

router.get('/:lease_id', auth, smartPasscodeController.getByLease);
router.post('/', auth, smartPasscodeController.create);
router.delete('/:passcode_id', auth, smartPasscodeController.delete);

module.exports = router;
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
