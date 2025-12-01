<<<<<<< HEAD
const db = require('../config/database');
const MaintenanceRequest = require('../models/MaintenanceRequest');

const validStatuses = ['open', 'in_progress', 'closed'];

=======
const MaintenanceRequest = require('../models/MaintenanceRequest');

>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
const maintenanceController = {
  getAll: async (req, res) => {
    try {
      const requests = await MaintenanceRequest.findAll();
      res.json(requests);
    } catch (error) {
<<<<<<< HEAD
      console.error('❌ Fetch error:', error);
=======
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      res.status(500).json({ message: 'Failed to fetch maintenance requests' });
    }
  },

  getById: async (req, res) => {
    try {
      const request = await MaintenanceRequest.findById(req.params.id);
<<<<<<< HEAD
      if (!request || Object.keys(request).length === 0) {
        return res.status(404).json({ message: 'Request not found' });
      }
      res.json(request);
    } catch (error) {
      console.error('❌ Fetch by ID error:', error);
      res.status(500).json({ message: 'Failed to fetch request' });
    }
  },
getByLandlord: async (req, res) => {
  try {
    const landlordId = req.params.id;

    const [rows] = await db.query(
      `SELECT mr.request_id, mr.property_id, mr.description, mr.status, mr.created_at,
              p.address, p.city, p.state
       FROM maintenancerequests mr
       JOIN properties p ON mr.property_id = p.property_id
       WHERE p.user_id = ?
       ORDER BY mr.created_at DESC`,
      [landlordId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ Error fetching landlord maintenance requests:', err);
    res.status(500).json({ message: 'Failed to fetch maintenance requests' });
  }
},
  create: async (req, res) => {
    try {
      const user_id = req.user.user_id;
      const { property_id, description } = req.body;

      const newRequest = await MaintenanceRequest.create({
        property_id,
        user_id,
        description,
        status: 'open'
      });

      res.status(201).json({ message: '✅ Request submitted', request: newRequest });
    } catch (error) {
      console.error('❌ Create error:', error);
=======
      if (!request) return res.status(404).json({ message: 'Request not found' });
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch request' });
    }
  },

  create: async (req, res) => {
    try {
      const newRequest = await MaintenanceRequest.create(req.body);
      res.status(201).json({ message: 'Request submitted', request: newRequest });
    } catch (error) {
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      res.status(500).json({ message: 'Failed to submit request' });
    }
  },

  update: async (req, res) => {
    try {
<<<<<<< HEAD
      const { status, assigned_to } = req.body;

      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const updated = await MaintenanceRequest.update(req.params.id, {
        ...(status && { status }),
        ...(assigned_to && { assigned_to })
      });

      if (!updated) {
        return res.status(404).json({ message: 'Request not found' });
      }

      res.json({ message: '✅ Request updated', request: updated });
    } catch (error) {
      console.error('❌ Update error:', error);
=======
      const updated = await MaintenanceRequest.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Request not found' });
      res.json({ message: 'Request updated', request: updated });
    } catch (error) {
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      res.status(500).json({ message: 'Failed to update request' });
    }
  },

  delete: async (req, res) => {
    try {
      const deleted = await MaintenanceRequest.delete(req.params.id);
<<<<<<< HEAD
      if (!deleted) {
        return res.status(404).json({ message: 'Request not found' });
      }
      res.json({ message: '✅ Request deleted' });
    } catch (error) {
      console.error('❌ Delete error:', error);
=======
      if (!deleted) return res.status(404).json({ message: 'Request not found' });
      res.json({ message: 'Request deleted' });
    } catch (error) {
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      res.status(500).json({ message: 'Failed to delete request' });
    }
  }
};

module.exports = maintenanceController;