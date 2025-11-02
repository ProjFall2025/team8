const express = require('express');
const router = express.Router();
const userReminderController = require('../controllers/userReminderController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

router.get('/:user_id', auth, role('admin', 'landlord', 'tenant'), userReminderController.getByUser);
router.post('/', auth, role('admin', 'landlord'), userReminderController.create);

module.exports = router;