const LeaseTenant = require('../models/LeaseTenant');

const leaseTenantController = {
  getAll: async (req, res) => {
    try {
      const tenants = await LeaseTenant.findAll();
      res.json(tenants);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch lease tenants' });
    }
  },

  getByLandlord: async (req, res) => {
    try {
      const landlordId = req.params.landlordId;
      console.log('📡 Controller received landlordId:', landlordId);

      const tenants = await LeaseTenant.findByLandlord(landlordId);
      console.log('✅ Query result:', tenants);

      if (!tenants || tenants.length === 0) {
        return res.status(404).json({ message: 'No tenants found for this landlord' });
      }

      res.status(200).json(tenants);
    } catch (error) {
      console.error('❌ Controller error in getByLandlord:', error);
      res.status(500).json({ error: 'Failed to fetch tenants for landlord' });
    }
  },

  getByLease: async (req, res) => {
    try {
      const tenants = await LeaseTenant.findByLease(req.params.leaseId);
      res.json(tenants);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tenants for lease' });
    }
  },

  getByUser: async (req, res) => {
    try {
      const leases = await LeaseTenant.findByUser(req.params.userId);
      res.json(leases);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch leases for user' });
    }
  },

  addTenant: async (req, res) => {
    try {
      const updated = await LeaseTenant.addTenant(req.body);
      res.status(201).json({ message: 'Tenant added to lease', tenants: updated });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add tenant' });
    }
  },

  removeTenant: async (req, res) => {
    try {
      const removed = await LeaseTenant.removeTenant(req.body);
      if (!removed) return res.status(404).json({ message: 'Tenant not found in lease' });
      res.json({ message: 'Tenant removed from lease' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove tenant' });
    }
  }
};

module.exports = leaseTenantController;