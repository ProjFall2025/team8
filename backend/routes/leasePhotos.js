const express = require('express');
const router = express.Router();
const leasePhotoController = require('../controllers/leasePhotoController');
const auth = require('../middlewares/auth');

router.get('/', auth, leasePhotoController.getAll);
router.get('/:leaseId', auth, leasePhotoController.getByLease);
router.post('/', auth, leasePhotoController.create);
router.delete('/:photo_id', auth, leasePhotoController.delete);

module.exports = router;