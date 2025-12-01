const Payment = require('../models/Payments');

const paymentHistoryController = {
  getByUser: async (req, res) => {
<<<<<<< HEAD
  try {
    const userId = Number(req.user.userId); // ✅ from decoded token
    const history = await Payment.findByUser(userId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
},
=======
    try {
      const history = await Payment.findByUser(req.params.user_id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch payment history' });
    }
  },
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0

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