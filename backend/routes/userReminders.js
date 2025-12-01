const express = require('express');
const router = express.Router();
const userReminderController = require('../controllers/userReminderController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

<<<<<<< HEAD
// ✅ GET reminders for a user (tenant, landlord, admin)
router.get(
  '/:user_id',
  auth,
  role('admin', 'landlord', 'tenant'),
  userReminderController.getByUser
);

// ✅ POST create reminder (admin, landlord only)
router.post(
  '/',
  auth,
  role('admin', 'landlord'),
  userReminderController.create
);

// ✅ DELETE reminder by ID (admin, landlord only)
router.delete(
  '/:reminder_id',
  auth,
  role('admin', 'landlord'),
  userReminderController.delete
);
=======
router.get('/:user_id', auth, role('admin', 'landlord', 'tenant'), userReminderController.getByUser);
router.post('/', auth, role('admin', 'landlord'), userReminderController.create);
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0

module.exports = router;