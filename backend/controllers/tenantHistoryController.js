const TenantHistory = require('../models/TenantHistory');

const tenantHistoryController = {
  getAll: async (req, res) => {
    try {
      const rows = await TenantHistory.getAll();
      res.status(200).json(rows);
    } catch (err) {
      console.error('Error fetching tenant history:', err);
      res.status(500).json({ error: 'Failed to fetch tenant history' });
    }
  },

  getByLease: async (req, res) => {
    try {
      const { lease_id } = req.params;

      if (!lease_id || isNaN(lease_id)) {
        return res.status(400).json({ error: 'Invalid or missing lease_id' });
      }

      const rows = await TenantHistory.getByLease(lease_id);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'No tenant history found for this lease' });
      }

      res.status(200).json(rows);
    } catch (err) {
      console.error('Error fetching tenant history by lease:', err);
      res.status(500).json({ error: 'Failed to fetch tenant history' });
    }
  },

  getByUser: async (req, res) => {
    try {
      const history = await TenantHistory.findByUser(req.params.user_id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tenant history' });
    }
  },

  create: async (req, res) => {
    try {
      const newRecord = await TenantHistory.create(req.body);
      res.status(201).json(newRecord);
    } catch (err) {
      console.error('Error creating tenant history:', err);
      res.status(500).json({ error: 'Failed to create tenant history' });
    }
  },

  update: async (req, res) => {
    try {
      const affected = await TenantHistory.update(req.params.id, req.body);
      if (affected === 0) return res.status(404).json({ error: 'Tenant history not found' });
      res.status(200).json({ message: 'Tenant history updated successfully' });
    } catch (err) {
      console.error('Error updating tenant history:', err);
      res.status(500).json({ error: 'Failed to update tenant history' });
    }
  },

  delete: async (req, res) => {
    try {
      const affected = await TenantHistory.delete(req.params.id);
      if (affected === 0) return res.status(404).json({ error: 'Tenant history not found' });
      res.status(200).json({ message: 'Tenant history deleted successfully' });
    } catch (err) {
      console.error('Error deleting tenant history:', err);
      res.status(500).json({ error: 'Failed to delete tenant history' });
    }
  }
};

module.exports = tenantHistoryController;