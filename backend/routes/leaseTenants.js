const express = require('express');
const router = express.Router();
const leaseTenantController = require('../controllers/leaseTenantController');
const auth = require('../middlewares/auth');

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
router.delete('/', auth, leaseTenantController.removeTenant);

module.exports = router;