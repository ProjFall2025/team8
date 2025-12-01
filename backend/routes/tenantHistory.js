const express = require('express');
const router = express.Router();
const tenantHistoryController = require('../controllers/tenantHistoryController');
const auth = require('../middlewares/auth');

router.get('/lease/:lease_id', auth, tenantHistoryController.getByLease);
module.exports = router;