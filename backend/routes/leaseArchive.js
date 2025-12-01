const express = require('express');
const router = express.Router();
const leaseArchiveController = require('../controllers/leaseArchiveController');
const auth = require('../middlewares/auth');

// Lease archive routes
router.get('/', auth, leaseArchiveController.getAll);
router.get('/:leaseId', auth, leaseArchiveController.getByLease);
router.post('/', auth, leaseArchiveController.create);
router.delete('/:archive_id', auth, leaseArchiveController.delete);

module.exports = router;