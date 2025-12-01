const Payment = require('../models/Payments');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentController = {
<<<<<<< HEAD
  // 🔍 Get all payments (admin only)
  getAll: async (req, res) => {
    try {
      const payments = await Payment.findAll(); // now returns enriched rows
      res.status(200).json(payments); // ✅ always return array, even if empty
=======
  // 🔍 Get all payments
  getAll: async (req, res) => {
    try {
      const payments = await Payment.findAll();
      res.json(payments);
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
    } catch (error) {
      console.error('GetAll error:', error.message);
      res.status(500).json({ message: 'Failed to fetch payments' });
    }
  },
<<<<<<< HEAD
// 🔍 Get payments for a landlord
getByLandlord: async (req, res) => {
  try {
    const landlordId = req.params.landlordId;
    const payments = await Payment.findByLandlord(landlordId);
    res.status(200).json(payments); // always return array
  } catch (error) {
    console.error('GetByLandlord error:', error.message);
    res.status(500).json({ message: 'Failed to fetch landlord payments' });
  }
},
  // 🔍 Get payment by ID
  getById: async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.id);
=======

  // 🔍 Get payment by ID
  getById: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id); // ✅ Sequelize uses findByPk
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      if (!payment) return res.status(404).json({ message: 'Payment not found' });
      res.json(payment);
    } catch (error) {
      console.error('GetById error:', error.message);
      res.status(500).json({ message: 'Failed to fetch payment' });
    }
  },

<<<<<<< HEAD
  // 🔍 Get payments for logged-in tenant
  getByUser: async (req, res) => {
    console.log('📥 Controller: getByUser triggered');
    try {
      const userId = req.user?.userId;
      console.log('User ID:', userId);

      const payments = await Payment.findByUser(userId);
      console.log('Payments:', payments);

      res.status(200).json(payments); // ✅ always respond, even if empty
    } catch (error) {
      console.error('GetByUser error:', error.message);
      res.status(500).json({ message: 'Failed to fetch tenant payments' });
    }
  },

  // 📝 Create a new payment record
  create: async (req, res) => {
    const {
      user_id, lease_id, amount,
      paid_date, status, payment_type, payment_for_month
    } = req.body;

    if (!user_id || !lease_id || !amount || !paid_date || !status || !payment_type || !payment_for_month) {
      return res.status(400).json({ message: 'Missing required payment fields' });
    }

=======
  // 📝 Create a new payment record
  create: async (req, res) => {
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
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
<<<<<<< HEAD
      const deleted = await Payment.delete(req.params.id);
=======
      const deleted = await Payment.destroy({ where: { id: req.params.id } }); // ✅ Sequelize uses destroy
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      if (!deleted) return res.status(404).json({ message: 'Payment not found' });
      res.json({ message: 'Payment deleted' });
    } catch (error) {
      console.error('Delete error:', error.message);
      res.status(500).json({ message: 'Failed to delete payment' });
    }
  },

<<<<<<< HEAD
  // ✏️ Update a payment
  update: async (req, res) => {
    try {
      const updated = await Payment.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Payment not found' });
      res.json({ message: 'Payment updated' });
    } catch (error) {
      console.error('Update error:', error.message);
      res.status(500).json({ message: 'Failed to update payment' });
    }
  },

  // 💳 Create Stripe Checkout session
  createStripeSession: async (req, res) => {
    try {
      console.log('🔥 createStripeSession triggered');
      console.log('👤 req.user:', req.user);

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
=======
  // 💳 Create Stripe Checkout session
  createStripeSession: async (req, res) => {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; // ✅ Fallback for local dev
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'usd',
<<<<<<< HEAD
            product_data: { name: 'Rent Payment' },
            unit_amount: 100000, // $1000
          },
          quantity: 1,
        }],
        success_url: `${frontendUrl}/stripe-success`,
        cancel_url: `${frontendUrl}/stripe-cancel`,
        metadata: {
          user_id: req.user?.userId,
          created_by: 'tenant_dashboard',
        },
      });

      console.log('✅ Stripe session created:', session.url);
      return res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('❌ Stripe session error:', error.message);
=======
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
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      return res.status(500).json({ message: 'Stripe session failed', error: error.message });
    }
  }
};

module.exports = paymentController;