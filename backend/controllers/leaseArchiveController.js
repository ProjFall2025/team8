const LeaseArchive = require('../models/LeaseArchive');

const leaseArchiveController = {
  getAll: async (req, res) => {
    try {
      const archives = await LeaseArchive.findAll();
      res.json(archives);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch lease archives' });
    }
  },

  getByLease: async (req, res) => {
    try {
      const archives = await LeaseArchive.findByLease(req.params.leaseId);
      res.json(archives);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch archives for lease' });
    }
  },

  create: async (req, res) => {
    try {
      const newArchive = await LeaseArchive.create(req.body);
      res.status(201).json({ message: 'Lease archived', archive: newArchive });
    } catch (error) {
      res.status(500).json({ message: 'Failed to archive lease' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await LeaseArchive.delete(req.params.archive_id);
      if (!deleted) return res.status(404).json({ message: 'Archive not found' });
      res.json({ message: 'Archive deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete archive' });
    }
  }
};

module.exports = leaseArchiveController;