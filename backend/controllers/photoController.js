const Photo = require('../models/Photo');

const photoController = {
  getAll: async (req, res) => {
    try {
      const photos = await Photo.findAll();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch photos' });
    }
  },

  getByUser: async (req, res) => {
    try {
      const photos = await Photo.findByUser(req.params.user_id);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user photos' });
    }
  },

  upload: async (req, res) => {
    try {
      const newPhoto = await Photo.create(req.body);
      res.status(201).json({ message: 'Photo uploaded', photo: newPhoto });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload photo' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await Photo.delete(req.params.photo_id);
      if (!deleted) return res.status(404).json({ message: 'Photo not found' });
      res.json({ message: 'Photo deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete photo' });
    }
  }
};

module.exports = photoController;