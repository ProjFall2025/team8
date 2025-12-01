const express = require('express');
const router = express.Router();
const tenantHistoryController = require('../controllers/tenantHistoryController');
const auth = require('../middlewares/auth');

// Get tenant history by lease
router.get('/lease/:lease_id', auth, tenantHistoryController.getByLease);

// Get tenant history by user
router.get('/:user_id', auth, tenantHistoryController.getByUser);

// Create tenant history record
router.post('/', auth, tenantHistoryController.create);

module.exports = router;