const express = require('express');
const router = express.Router();
const leaseController = require('../controllers/leaseController');
const auth = require('../middlewares/auth');
<<<<<<< HEAD
const roleMiddleware = require('../middlewares/role');
const upload = require('../middlewares/upload');

// List all leases (admins see all, landlords see only their own)
router.get(
  '/',
  auth,
  roleMiddleware('admin', 'landlord'),
  leaseController.getAll
);

// Get leases by user_id (no role guard, scoped in controller)
// Get leases by user_id
router.get('/user/:user_id', auth, leaseController.getLeaseByUser);
// Get lease by ID
router.get('/:id', auth, leaseController.getById);

// Create lease
router.post('/', auth, roleMiddleware('admin', 'landlord'), leaseController.create);

// Update lease
router.put('/:id', auth, roleMiddleware('admin', 'landlord'), leaseController.update);

// Delete lease
router.delete('/:id', auth, roleMiddleware('admin', 'landlord'), leaseController.delete);

// Upload file to lease
router.put('/:id/file', auth, roleMiddleware('admin', 'landlord'), upload.single('file'), leaseController.uploadFile);
=======

router.get('/', auth, leaseController.getAll);
router.get('/:id', auth, leaseController.getById);
router.post('/', auth, leaseController.create);
router.put('/:id', auth, leaseController.update);
router.delete('/:id', auth, leaseController.delete);
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0

module.exports = router;