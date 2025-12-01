const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

<<<<<<< HEAD
// 💳 Stripe session (tenants & landlords only)
router.post('/create-session', auth, role('tenant', 'landlord'), paymentController.createStripeSession);

// 🔍 Admin: get all payments (enriched with tenant + property info)
router.get('/all', auth, role('admin'), paymentController.getAll);

// 🔍 Tenant: get own payments
router.get('/user', auth, role('tenant'), paymentController.getByUser);

// 🔍 Landlord: get payments by landlordId
router.get('/landlord/:landlordId', auth, role('landlord', 'admin'), paymentController.getByLandlord);

// 📝 Create a new payment (tenant or admin)
router.post('/', auth, role('tenant', 'admin'), paymentController.create);

// ❌ Delete payment (admin only)
router.delete('/:id', auth, role('admin'), paymentController.delete);

// 🔍 Get payment by ID (any authenticated user)
router.get('/:id', auth, paymentController.getById);

// ✏️ Update payment (admin only)
router.put('/:id', auth, role('admin'), paymentController.update);

// ✅ Test routes
router.put('/test', (req, res) => {
  res.json({ message: 'PUT /api/payments/test works' });
});

router.post('/test-session', (req, res) => {
  console.log('📥 /test-session hit');
  res.json({ ok: true });
});
=======
router.post('/create-session', auth, role('tenant', 'landlord'), paymentController.createStripeSession);

router.get('/', auth, role('Admin'), paymentController.getAll);

router.get('/:id', auth, paymentController.getById);

router.delete('/:id', auth, role('Admin'), paymentController.delete);
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0

module.exports = router;