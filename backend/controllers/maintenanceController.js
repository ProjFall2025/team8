const MaintenanceRequest = require('../models/MaintenanceRequest');

const maintenanceController = {
  getAll: async (req, res) => {
    try {
      const requests = await MaintenanceRequest.findAll();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch maintenance requests' });
    }
  },

  getById: async (req, res) => {
    try {
      const request = await MaintenanceRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ message: 'Request not found' });
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch request' });
    }
  },

  create: async (req, res) => {
    try {
      const newRequest = await MaintenanceRequest.create(req.body);
      res.status(201).json({ message: 'Request submitted', request: newRequest });
    } catch (error) {
      res.status(500).json({ message: 'Failed to submit request' });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await MaintenanceRequest.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Request not found' });
      res.json({ message: 'Request updated', request: updated });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update request' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await MaintenanceRequest.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Request not found' });
      res.json({ message: 'Request deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete request' });
    }
  }
};

module.exports = maintenanceController;