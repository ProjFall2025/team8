const express = require('express');
const router = express.Router();
const paymentHistoryController = require('../controllers/paymentHistoryController');
const auth = require('../middlewares/auth');

// Get payment history by user
router.get('/user/:user_id', auth, paymentHistoryController.getByUser);

// Get payment history by lease
router.get('/lease/:lease_id', auth, paymentHistoryController.getByLease);

module.exports = router;