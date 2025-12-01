const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/jwt');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', verifyToken, authController.getProfile);

// ✅ Password reset workflow
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;