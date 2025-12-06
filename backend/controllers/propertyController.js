const Property = require('../models/Property');
// 1. ✅ IMPORT the Lease model
const Lease = require('../models/Lease'); 

const propertyController = {
  getAll: async (req, res) => {
    try {
      const rows = await Property.getAll();
      res.status(200).json(rows);
    } catch (err) {
      console.error('Error fetching properties:', err);
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  },

  getById: async (req, res) => {
    try {
      const row = await Property.getById(req.params.id);
      if (!row) return res.status(404).json({ error: 'Property not found' });
      res.status(200).json(row);
    } catch (err) {
      console.error('Error fetching property by ID:', err);
      res.status(500).json({ error: 'Failed to fetch property' });
    }
  },

  getByUser: async (req, res) => {
    try {
      const { user_id } = req.query;
      if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

      const rows = await Property.getByUser(user_id);
      res.status(200).json(rows);
    } catch (err) {
      console.error('Error fetching properties by user:', err);
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  },

  // ✅ Get properties owned by landlord only
  getByLandlord: async (req, res) => {
    try {
      const landlordId = req.user.user_id;
      const rows = await Property.getByLandlord(landlordId);
      res.status(200).json(rows);
    } catch (err) {
      console.error('Error fetching landlord properties:', err);
      res.status(500).json({ error: 'Failed to fetch landlord properties' });
    }
  },

  // ✅ Get all properties with ownership flag for landlord dashboard
  getAllForLandlordDashboard: async (req, res) => {
    try {
      const landlordId = req.user.user_id;
      const rows = await Property.getAllWithOwnershipFlag(landlordId);
      res.status(200).json(rows);
    } catch (err) {
      console.error('Error fetching all properties for landlord dashboard:', err);
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  },

  create: async (req, res) => {
    try {
        // NOTE: This fixed value (43) should eventually be replaced with req.user.user_id
        const LANDLORD_ID = 43; 
        const propertyData = {
            ...req.body,
            user_id: LANDLORD_ID
        };

        const newProperty = await Property.create(propertyData);
        res.status(201).json(newProperty);
     } catch (err) {
        console.error('Error creating property:', err);
        res.status(500).json({ error: 'Failed to create property' });
     }
  },

  update: async (req, res) => {
    try {
      const affected = await Property.update(req.params.id, req.body);
      if (affected === 0) return res.status(404).json({ error: 'Property not found' });
      res.status(200).json({ message: 'Property updated successfully' });
    } catch (err) {
      console.error('Error updating property:', err);
      res.status(500).json({ error: 'Failed to update property' });
    }
  },

  delete: async (req, res) => {
    const propertyId = req.params.id; // Get the ID once
    try {
      // 2. 🛑 CRITICAL FIX: Delete associated leases first (CASCADE DELETE)
      const deletedLeaseCount = await Lease.deleteByPropertyId(propertyId);
      console.log(`🗑️ Deleted ${deletedLeaseCount} lease(s) for property ${propertyId}`);
        
      // 3. Now delete the property
      const affected = await Property.delete(propertyId);
      
      if (affected === 0) return res.status(404).json({ error: 'Property not found' });
      
      res.status(200).json({ message: 'Property and associated data deleted successfully' });
    } catch (err) {
      console.error('Error deleting property:', err);
      res.status(500).json({ error: 'Failed to delete property' });
    }
  },

  countByUser: async (req, res) => {
    try {
      const rows = await Property.countByUser();
      res.status(200).json(rows);
    } catch (err) {
      console.error('Error counting properties by user:', err);
      res.status(500).json({ error: 'Failed to count properties' });
    }
  }
};

module.exports = propertyController;