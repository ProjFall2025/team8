const express = require('express');
const router = express.Router();
const paymentHistoryController = require('../controllers/paymentHistoryController');
const auth = require('../middlewares/auth');

<<<<<<< HEAD
router.get('/user', auth, paymentHistoryController.getByUser);
=======
router.get('/user/:user_id', auth, paymentHistoryController.getByUser);
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
router.get('/lease/:lease_id', auth, paymentHistoryController.getByLease);

module.exports = router;