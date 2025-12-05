const Photo = require('../models/Photo');

const photoController = {
  getAll: async (req, res) => {
    try {
      const photos = await Photo.findAll();
      res.json(photos);
    } catch (error) {
      console.error('Error fetching all photos:', error);
      res.status(500).json({ message: 'Failed to fetch photos' });
    }
  },

  getByUser: async (req, res) => {
    try {
      const photos = await Photo.findByUser(req.params.user_id);
      res.json(photos);
    } catch (error) {
      console.error('Error fetching user photos:', error);
      res.status(500).json({ message: 'Failed to fetch user photos' });
    }
  },

  // NEW FUNCTION: Controller to fetch photos by lease ID
  getByLease: async (req, res) => {
    try {
      const { lease_id } = req.params;
      console.log(`🔍 Fetching photos for lease ID: ${lease_id}`);
      const photos = await Photo.findByLease(lease_id);
      res.json(photos);
    } catch (error) {
      console.error('Error fetching lease photos:', error);
      res.status(500).json({ message: 'Failed to fetch photos for this lease' });
    }
  },

  upload: async (req, res) => {
    try {
      const newPhoto = await Photo.create(req.body);
      res.status(201).json({ message: 'Photo uploaded', photo: newPhoto });
    } catch (error) {
      console.error('Error uploading photo:', error);
      res.status(500).json({ message: 'Failed to upload photo' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await Photo.delete(req.params.photo_id);
      if (!deleted) return res.status(404).json({ message: 'Photo not found' });
      res.json({ message: 'Photo deleted' });
    } catch (error) {
      console.error('Error deleting photo:', error);
      res.status(500).json({ message: 'Failed to delete photo' });
    }
  }
};

module.exports = photoController;