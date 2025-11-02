const TenantHistory = require('../models/TenantHistory');

const tenantHistoryController = {
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
      res.status(201).json({ message: 'Tenant history recorded', record: newRecord });
    } catch (error) {
      res.status(500).json({ message: 'Failed to record tenant history' });
    }
  }
};

module.exports = tenantHistoryController;