const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

router.post('/create-session', auth, role('tenant', 'landlord'), paymentController.createStripeSession);

router.get('/', auth, role('Admin'), paymentController.getAll);

router.get('/:id', auth, paymentController.getById);

router.delete('/:id', auth, role('Admin'), paymentController.delete);

module.exports = router;