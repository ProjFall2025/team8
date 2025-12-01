const express = require('express');
const router = express.Router();
const tenantHistoryController = require('../controllers/tenantHistoryController');
const auth = require('../middlewares/auth');

<<<<<<< HEAD
router.get('/lease/:lease_id', auth, tenantHistoryController.getByLease);
=======
router.get('/:user_id', auth, tenantHistoryController.getByUser);
router.post('/', auth, tenantHistoryController.create);

>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
module.exports = router;