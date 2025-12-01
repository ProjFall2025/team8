const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const auth = require('../middlewares/auth');

<<<<<<< HEAD
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
=======
router.get('/', auth, maintenanceController.getAll);
router.get('/:id', auth, maintenanceController.getById);
router.post('/', auth, maintenanceController.create);
router.put('/:id', auth, maintenanceController.update);
router.delete('/:id', auth, maintenanceController.delete);
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0

module.exports = router;