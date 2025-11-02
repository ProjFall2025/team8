const Property = require('../models/Property');

const propertyController = {
  getAll: async (req, res) => {
    try {
      const properties = await Property.findAll();
      res.status(200).json(properties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  },

  getById: async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).json({ error: 'Property not found' });
      res.status(200).json(property);
    } catch (err) {
      console.error('Error fetching property by ID:', err);
      res.status(500).json({ error: 'Failed to fetch property' });
    }
  },

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
      const updated = await Property.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Property not found' });
      res.status(200).json({ message: 'Property updated successfully' });
    } catch (err) {
      console.error('Error updating property:', err);
      res.status(500).json({ error: 'Failed to update property' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await Property.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Property not found' });
      res.status(200).json({ message: 'Property deleted successfully' });
    } catch (err) {
      console.error('Error deleting property:', err);
      res.status(500).json({ error: 'Failed to delete property' });
    }
  }
};

module.exports = propertyController;