const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const auth = require('../middlewares/auth');

router.get('/', auth, photoController.getAll);
router.get('/user/:user_id', auth, photoController.getByUser);

// NEW ROUTE ADDED: To fetch photos based on a specific lease ID
// This handles the frontend call to /api/photos/lease/:lease_id
router.get('/lease/:lease_id', auth, photoController.getByLease);

router.post('/', auth, photoController.upload);
router.delete('/:photo_id', auth, photoController.delete);

module.exports = router;