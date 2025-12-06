const LeasePhoto = require('../models/LeasePhoto');

const leasePhotoController = {
  // Get all photos (admin use)
  getAll: async (req, res) => {
    try {
      const photos = await LeasePhoto.findAll();
      const formatted = photos.map(p => ({
        id: p.photo_id,
        lease_id: p.lease_id,
        url: p.photo_url,
        uploaded_by: p.uploaded_by,
        uploaded_at: p.uploaded_at,
        is_visible_to_tenant: !!p.is_visible_to_tenant
      }));
      res.json(formatted);
    } catch (error) {
      console.error('Get all photos error:', error);
      res.status(500).json({ error: 'Failed to fetch lease photos' });
    }
  },

  // Get photos by lease
  getByLease: async (req, res) => {
    try {
      const leaseId = parseInt(req.params.leaseId);
      if (isNaN(leaseId)) {
        return res.status(400).json({ error: 'Invalid lease ID' });
      }

      const photos = await LeasePhoto.findByLease(leaseId);
      const formatted = photos.map(p => ({
        id: p.photo_id,
        lease_id: p.lease_id,
        url: p.photo_url,
        uploaded_by: p.uploaded_by,
        uploaded_at: p.uploaded_at,
        is_visible_to_tenant: !!p.is_visible_to_tenant
      }));
      res.json(formatted);
    } catch (error) {
      console.error('Get by lease error:', error);
      res.status(500).json({ error: 'Failed to fetch photos for lease' });
    }
  },

  // Create photo (direct insert)
  create: async (req, res) => {
    try {
      const newPhoto = await LeasePhoto.create(req.body);
      res.status(201).json({
        message: 'Lease photo uploaded',
        photo: {
          id: newPhoto.photo_id,
          lease_id: newPhoto.lease_id,
          url: newPhoto.photo_url,
          uploaded_by: newPhoto.uploaded_by,
          uploaded_at: newPhoto.uploaded_at,
          is_visible_to_tenant: !!newPhoto.is_visible_to_tenant
        }
      });
    } catch (error) {
      console.error('Create photo error:', error);
      res.status(500).json({ error: 'Failed to upload lease photo' });
    }
  },

  // Upload photo via file
  upload: async (req, res) => {
    const leaseId = parseInt(req.params.leaseId);
    const file = req.file;
    const userId = req.user?.user_id; // assuming auth middleware sets req.user

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const newPhoto = await LeasePhoto.create({
  lease_id: leaseId,
photo_url: `/files/${file.filename}`,  // ✅ add leading slash  uploaded_by: userId || null,
  is_visible_to_tenant: 0
});

      res.status(201).json({
        message: 'Lease photo uploaded',
        photo: {
          id: newPhoto.photo_id,
          lease_id: newPhoto.lease_id,
          url: newPhoto.photo_url,
          uploaded_by: newPhoto.uploaded_by,
          uploaded_at: newPhoto.uploaded_at,
          is_visible_to_tenant: !!newPhoto.is_visible_to_tenant
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload lease photo' });
    }
  },

  // Update visibility (optional for landlords/admins)
  updateVisibility: async (req, res) => {
    try {
      const photoId = parseInt(req.params.photo_id);
      const visible = req.body.is_visible_to_tenant ? 1 : 0;

      const [result] = await LeasePhoto.updateVisibility(photoId, visible);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Lease photo not found' });
      }

      res.json({
        message: 'Visibility updated',
        photo_id: photoId,
        is_visible_to_tenant: !!visible
      });
    } catch (error) {
      console.error('Update visibility error:', error);
      res.status(500).json({ error: 'Failed to update visibility' });
    }
  },

  // Delete photo
  delete: async (req, res) => {
    try {
      const photoId = parseInt(req.params.photo_id);
      if (isNaN(photoId)) {
        return res.status(400).json({ error: 'Invalid photo ID' });
      }

      const deleted = await LeasePhoto.delete(photoId);
      if (!deleted) {
        return res.status(404).json({ error: 'Lease photo not found' });
      }
      res.json({ message: 'Lease photo deleted', id: photoId });
    } catch (error) {
      console.error('Delete photo error:', error);
      res.status(500).json({ error: 'Failed to delete lease photo' });
    }
  }
};

module.exports = leasePhotoController;