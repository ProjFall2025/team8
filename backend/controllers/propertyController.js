const Property = require('../models/Property');

const propertyController = {
  getAll: async (req, res) => {
    try {
<<<<<<< HEAD
      const rows = await Property.getAll();
      res.status(200).json(rows);
=======
      const properties = await Property.findAll();
      res.status(200).json(properties);
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
    } catch (err) {
      console.error('Error fetching properties:', err);
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  },

  getById: async (req, res) => {
    try {
<<<<<<< HEAD
      const row = await Property.getById(req.params.id);
      if (!row) return res.status(404).json({ error: 'Property not found' });
      res.status(200).json(row);
=======
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).json({ error: 'Property not found' });
      res.status(200).json(property);
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
    } catch (err) {
      console.error('Error fetching property by ID:', err);
      res.status(500).json({ error: 'Failed to fetch property' });
    }
  },

<<<<<<< HEAD
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

=======
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  create: async (req, res) => {
    try {
      const newProperty = await Property.create(req.body);
      res.status(201).json(newProperty);
    } catch (err) {
      console.error('Error creating property:', err);
      res.status(500).json({ error: 'Failed to create property' });
    }
  },

  update: async (req, res) => {
    try {
<<<<<<< HEAD
      const affected = await Property.update(req.params.id, req.body);
      if (affected === 0) return res.status(404).json({ error: 'Property not found' });
=======
      const updated = await Property.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Property not found' });
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      res.status(200).json({ message: 'Property updated successfully' });
    } catch (err) {
      console.error('Error updating property:', err);
      res.status(500).json({ error: 'Failed to update property' });
    }
  },

  delete: async (req, res) => {
    try {
<<<<<<< HEAD
      const affected = await Property.delete(req.params.id);
      if (affected === 0) return res.status(404).json({ error: 'Property not found' });
=======
      const deleted = await Property.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Property not found' });
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      res.status(200).json({ message: 'Property deleted successfully' });
    } catch (err) {
      console.error('Error deleting property:', err);
      res.status(500).json({ error: 'Failed to delete property' });
    }
<<<<<<< HEAD
  },

  countByUser: async (req, res) => {
    try {
      const rows = await Property.countByUser();
      res.status(200).json(rows);
    } catch (err) {
      console.error('Error counting properties by user:', err);
      res.status(500).json({ error: 'Failed to count properties' });
    }
=======
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  }
};

module.exports = propertyController;