const express = require('express');
const router = express.Router();
const leaseTenantController = require('../controllers/leaseTenantController');
const auth = require('../middlewares/auth');

router.get('/', auth, leaseTenantController.getAll);
router.get('/lease/:leaseId', auth, leaseTenantController.getByLease);
router.get('/user/:userId', auth, leaseTenantController.getByUser);
router.post('/', auth, leaseTenantController.addTenant);
router.delete('/', auth, leaseTenantController.removeTenant);

module.exports = router;