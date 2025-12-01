const express = require('express');
const router = express.Router();
const leaseTenantController = require('../controllers/leaseTenantController');
const auth = require('../middlewares/auth');

<<<<<<< HEAD
// Get all lease–tenant relationships (admin use)
router.get('/', auth, leaseTenantController.getAll);

// Get tenants by lease
router.get('/lease/:leaseId', auth, leaseTenantController.getByLease);

// Get leases by user
router.get('/user/:userId', auth, leaseTenantController.getByUser);

// Get tenants by landlord
router.get('/landlord-tenants/:landlordId', auth, leaseTenantController.getByLandlord);

// Add tenant to a lease
router.post('/', auth, leaseTenantController.addTenant);

// Remove tenant from a lease
=======
router.get('/', auth, leaseTenantController.getAll);
router.get('/lease/:leaseId', auth, leaseTenantController.getByLease);
router.get('/user/:userId', auth, leaseTenantController.getByUser);
router.post('/', auth, leaseTenantController.addTenant);
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
router.delete('/', auth, leaseTenantController.removeTenant);

module.exports = router;