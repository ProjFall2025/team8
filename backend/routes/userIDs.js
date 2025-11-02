const express = require('express');
const router = express.Router();
const userIDController = require('../controllers/userIDController');
const auth = require('../middlewares/auth');

router.get('/:user_id', auth, userIDController.getByUser);
router.post('/', auth, userIDController.create);
router.delete('/:id', auth, userIDController.delete);

module.exports = router;