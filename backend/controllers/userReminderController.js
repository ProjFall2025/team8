const UserReminder = require('../models/UserReminder');

const userReminderController = {
<<<<<<< HEAD
  // GET reminders by user ID
=======
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  getByUser: async (req, res) => {
    try {
      const reminders = await UserReminder.findByUser(req.params.user_id);
      res.json(reminders);
    } catch (error) {
<<<<<<< HEAD
      console.error('Fetch reminders error:', error);
=======
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      res.status(500).json({ message: 'Failed to fetch reminders' });
    }
  },

<<<<<<< HEAD
  // POST create new reminder
=======
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  create: async (req, res) => {
    try {
      const newReminder = await UserReminder.create(req.body);
      res.status(201).json({ message: 'Reminder created', reminder: newReminder });
    } catch (error) {
<<<<<<< HEAD
      console.error('Create reminder error:', error);
=======
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      res.status(500).json({ message: 'Failed to create reminder' });
    }
  },

<<<<<<< HEAD
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
=======
  delete: async (req, res) => {
    try {
      const deleted = await UserReminder.delete(req.params.reminder_id);
      if (!deleted) return res.status(404).json({ message: 'Reminder not found' });
      res.json({ message: 'Reminder deleted' });
    } catch (error) {
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      res.status(500).json({ message: 'Failed to delete reminder' });
    }
  }
};

module.exports = userReminderController;