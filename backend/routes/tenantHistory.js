const express = require('express');
const router = express.Router();
const tenantHistoryController = require('../controllers/tenantHistoryController');
const auth = require('../middlewares/auth');

router.get('/:user_id', auth, tenantHistoryController.getByUser);
router.post('/', auth, tenantHistoryController.create);

module.exports = router;