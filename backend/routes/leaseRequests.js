const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const leaseRequestController = require('../controllers/LeaseRequestController'); // match file casing

// Tenant: submit a new request
router.post('/', authenticate, leaseRequestController.createRequest);

// Tenant: view their own requests
router.get('/user/:userId', authenticate, leaseRequestController.getRequestsByUser);

// Landlord/Admin: view all pending requests
router.get('/pending', authenticate, leaseRequestController.getPendingRequests);

// Landlord/Admin: update request status
router.put('/:requestId', authenticate, leaseRequestController.updateRequestStatus);

module.exports = router;