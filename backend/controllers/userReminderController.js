const UserReminder = require('../models/UserReminder');

const userReminderController = {
  // GET reminders by user ID
  getByUser: async (req, res) => {
    try {
      const reminders = await UserReminder.findByUser(req.params.user_id);
      res.json(reminders);
    } catch (error) {
      console.error('Fetch reminders error:', error);
      res.status(500).json({ message: 'Failed to fetch reminders' });
    }
  },

  // POST create new reminder
  create: async (req, res) => {
    try {
      const newReminder = await UserReminder.create(req.body);
      res.status(201).json({ message: 'Reminder created', reminder: newReminder });
    } catch (error) {
      console.error('Create reminder error:', error);
      res.status(500).json({ message: 'Failed to create reminder' });
    }
  },

  // DELETE reminder by ID
  delete: async (req, res) => {
    try {
      const deleted = await UserReminder.delete(req.params.reminder_id);
      if (!deleted) {
        return res.status(404).json({ message: 'Reminder not found' });
      }
      res.json({ message: 'Reminder deleted' });
    } catch (error) {
      console.error('Delete reminder error:', error);
      res.status(500).json({ message: 'Failed to delete reminder' });
    }
  }
};

module.exports = userReminderController;