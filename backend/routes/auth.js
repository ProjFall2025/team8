const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/jwt');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', verifyToken, authController.getProfile);
<<<<<<< HEAD
router.post('/forgot-password', authController.forgotPassword); // ✅ NEW
router.post('/reset-password', authController.resetPassword);

=======
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0

module.exports = router;