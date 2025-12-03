const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // 🔒 Force every new user to be tenant
      const role = 'tenant';

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword, role });

      // ✅ Use snake_case in JWT payload
      const token = jwt.sign(
        {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        role: user.role,
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('❌ Register error:', error);
      res.status(500).json({ message: 'Registration failed', error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
console.log('--- LOGIN DEBUG ---');
      console.log('Incoming Password:', password); 
      console.log('Stored Hash (user.password):', user.password); // <-- Check this value
      console.log('-------------------');
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Login failed. Check your credentials.' });
      }

      // ✅ Consistent payload
      const token = jwt.sign(
        {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(200).json({
        message: 'Login successful',
        token,
        role: user.role,
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error('❌ Profile error:', error);
      res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await User.updateResetToken(user.user_id, token, expiry);

const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;      console.log(`📧 Simulated reset link: ${resetLink}`);

      res.status(200).json({ message: 'Reset link sent to your email (simulated)' });
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      res.status(500).json({ message: 'Failed to process request', error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      const user = await User.findByResetToken(token);
      if (!user || new Date(user.reset_token_expiry) < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(user.user_id, hashed);
      await User.clearResetToken(user.user_id);

      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('❌ Reset password error:', error);
      res.status(500).json({ message: 'Failed to reset password', error: error.message });
    }
  },
};

module.exports = authController;
