const express = require('express');
const router = express.Router();
const leaseController = require('../controllers/leaseController');
const auth = require('../middlewares/auth');

router.get('/', auth, leaseController.getAll);
router.get('/:id', auth, leaseController.getById);
router.post('/', auth, leaseController.create);
router.put('/:id', auth, leaseController.update);
router.delete('/:id', auth, leaseController.delete);

module.exports = router;