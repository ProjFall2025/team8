const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middlewares/auth');

router.get('/:lease_id', auth, documentController.getByLease);
router.post('/', auth, documentController.upload);

module.exports = router;