const express = require('express');
const router = express.Router();
const paymentHistoryController = require('../controllers/paymentHistoryController');
const auth = require('../middlewares/auth');

router.get('/user', auth, paymentHistoryController.getByUser);
router.get('/lease/:lease_id', auth, paymentHistoryController.getByLease);

module.exports = router;