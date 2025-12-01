const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const auth = require('../middlewares/auth');

// Get properties by user (query param)
router.get('/user', propertyController.getByUser);

// ✅ Updated: Get properties owned by landlord (uses JWT user_id, no :id in URL)
router.get('/landlord', auth, propertyController.getByLandlord);
router.get('/landlord/all', auth, propertyController.getAllForLandlordDashboard);
// Get all properties
router.get('/', auth, propertyController.getAll);

// Create new property
router.post('/', auth, propertyController.create);

// Get property by ID
router.get('/:id', auth, propertyController.getById);

// Update property by ID
router.put('/:id', auth, propertyController.update);

// Delete property by ID
router.delete('/:id', auth, propertyController.delete);

module.exports = router;