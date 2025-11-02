const express = require('express');
const router = express.Router();
const smartPasscodeController = require('../controllers/smartPasscodeController');
const auth = require('../middlewares/auth');

router.get('/:lease_id', auth, smartPasscodeController.getByLease);
router.post('/', auth, smartPasscodeController.create);
router.delete('/:passcode_id', auth, smartPasscodeController.delete);

module.exports = router;