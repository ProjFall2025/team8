const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const authController = {
  register: async (req, res) => {
    try {
      console.log('📥 Register request received:', req.body);

      const { name, email, password, role } = req.body;

      const existingUser = await User.findByEmail(email);
      console.log('🔍 Existing user:', existingUser);

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // ✅ Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({ name, email, password: hashedPassword, role });
      console.log('✅ New user created:', user);

      const token = jwt.sign(
        {
          userId: user.user_id,
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
          id: user.user_id,
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

      // ✅ Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Login failed. Check your credentials.' });
      }

      const token = jwt.sign(
        {
          userId: user.user_id,
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
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
  },
};

module.exports = authController;