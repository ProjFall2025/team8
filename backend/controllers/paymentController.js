const Payment = require('../models/Payments');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentController = {
  // 🔍 Get all payments
  getAll: async (req, res) => {
    try {
      const payments = await Payment.findAll();
      res.json(payments);
    } catch (error) {
      console.error('GetAll error:', error.message);
      res.status(500).json({ message: 'Failed to fetch payments' });
    }
  },

  // 🔍 Get payment by ID
  getById: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id); // ✅ Sequelize uses findByPk
      if (!payment) return res.status(404).json({ message: 'Payment not found' });
      res.json(payment);
    } catch (error) {
      console.error('GetById error:', error.message);
      res.status(500).json({ message: 'Failed to fetch payment' });
    }
  },

  // 📝 Create a new payment record
  create: async (req, res) => {
    try {
      const newPayment = await Payment.create(req.body);
      res.status(201).json({ message: 'Payment recorded', payment: newPayment });
    } catch (error) {
      console.error('Create error:', error.message);
      res.status(500).json({ message: 'Failed to record payment' });
    }
  },

  // ❌ Delete a payment
  delete: async (req, res) => {
    try {
      const deleted = await Payment.destroy({ where: { id: req.params.id } }); // ✅ Sequelize uses destroy
      if (!deleted) return res.status(404).json({ message: 'Payment not found' });
      res.json({ message: 'Payment deleted' });
    } catch (error) {
      console.error('Delete error:', error.message);
      res.status(500).json({ message: 'Failed to delete payment' });
    }
  },

  // 💳 Create Stripe Checkout session
  createStripeSession: async (req, res) => {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; // ✅ Fallback for local dev

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Rent Payment',
            },
            unit_amount: 100000, // $1000.00
          },
          quantity: 1,
        }],
        success_url: `${frontendUrl}/payment-success`,
        cancel_url: `${frontendUrl}/payment-cancel`,
      });

      return res.status(200).json({ url: session.url }); // ✅ Explicit 200 status
    } catch (error) {
      console.error('Stripe session error:', error.message);
      return res.status(500).json({ message: 'Stripe session failed', error: error.message });
    }
  }
};

module.exports = paymentController;