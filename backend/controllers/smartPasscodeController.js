const SmartPasscode = require('../models/SmartPasscode');

const smartPasscodeController = {
  getByLease: async (req, res) => {
    try {
      const passcodes = await SmartPasscode.findByLease(req.params.lease_id);
      res.json(passcodes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch passcodes' });
    }
  },

  create: async (req, res) => {
    try {
      const newCode = await SmartPasscode.create(req.body);
      res.status(201).json({ message: 'Passcode created', passcode: newCode });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create passcode' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await SmartPasscode.delete(req.params.passcode_id);
      if (!deleted) return res.status(404).json({ message: 'Passcode not found' });
      res.json({ message: 'Passcode deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete passcode' });
    }
  }
};

module.exports = smartPasscodeController;