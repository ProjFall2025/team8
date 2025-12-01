const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const auth = require('../middlewares/auth');

const authorize = (roles) => (req, res, next) => {
  const role = req.user.role?.toLowerCase();
  if (!roles.map(r => r.toLowerCase()).includes(role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// ✅ Landlord-specific maintenance route
router.get('/landlord/:id', auth, authorize(['landlord']), maintenanceController.getByLandlord);

// Generic maintenance routes
router.get('/', auth, authorize(['admin','landlord']), maintenanceController.getAll);
router.get('/:id', auth, authorize(['admin','landlord']), maintenanceController.getById);
router.post('/', auth, authorize(['tenant']), maintenanceController.create);
router.patch('/:id', auth, authorize(['admin','landlord']), maintenanceController.update);
router.delete('/:id', auth, authorize(['admin']), maintenanceController.delete);

module.exports = router;