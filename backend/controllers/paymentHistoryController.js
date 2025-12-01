const Payment = require('../models/Payments');

const paymentHistoryController = {
  getByUser: async (req, res) => {
  try {
    const userId = Number(req.user.userId); // ✅ from decoded token
    const history = await Payment.findByUser(userId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
},

  getByLease: async (req, res) => {
    try {
      const history = await Payment.findByLease(req.params.lease_id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch lease payment history' });
    }
  }
};

module.exports = paymentHistoryController;