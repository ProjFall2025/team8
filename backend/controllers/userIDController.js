const UserID = require('../models/UserID');

const userIDController = {
  getByUser: async (req, res) => {
    try {
      const ids = await UserID.findByUser(req.params.user_id);
      res.json(ids);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user IDs' });
    }
  },

  create: async (req, res) => {
    try {
      const newID = await UserID.create(req.body);
      res.status(201).json({ message: 'User ID created', id: newID });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create user ID' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await UserID.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'User ID not found' });
      res.json({ message: 'User ID deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete user ID' });
    }
  }
};

module.exports = userIDController;