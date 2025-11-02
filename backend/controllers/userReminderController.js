const UserReminder = require('../models/UserReminder');

const userReminderController = {
  getByUser: async (req, res) => {
    try {
      const reminders = await UserReminder.findByUser(req.params.user_id);
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch reminders' });
    }
  },

  create: async (req, res) => {
    try {
      const newReminder = await UserReminder.create(req.body);
      res.status(201).json({ message: 'Reminder created', reminder: newReminder });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create reminder' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await UserReminder.delete(req.params.reminder_id);
      if (!deleted) return res.status(404).json({ message: 'Reminder not found' });
      res.json({ message: 'Reminder deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete reminder' });
    }
  }
};

module.exports = userReminderController;