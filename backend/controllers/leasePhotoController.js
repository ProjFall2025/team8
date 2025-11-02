const LeasePhoto = require('../models/LeasePhoto');

const leasePhotoController = {
  getAll: async (req, res) => {
    try {
      const photos = await LeasePhoto.findAll();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch lease photos' });
    }
  },

  getByLease: async (req, res) => {
    try {
      const photos = await LeasePhoto.findByLease(req.params.leaseId);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch photos for lease' });
    }
  },

  create: async (req, res) => {
    try {
      const newPhoto = await LeasePhoto.create(req.body);
      res.status(201).json({ message: 'Lease photo uploaded', photo: newPhoto });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload lease photo' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await LeasePhoto.delete(req.params.photo_id);
      if (!deleted) return res.status(404).json({ message: 'Lease photo not found' });
      res.json({ message: 'Lease photo deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete lease photo' });
    }
  }
};

module.exports = leasePhotoController;