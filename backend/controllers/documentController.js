const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');

const documentController = {
  // GET documents by lease with role-based filtering
  getByLease: async (req, res) => {
    try {
      const { lease_id } = req.params;
      const { id: user_id, role } = req.user;

      const docs = await Document.getByLease(lease_id, user_id, role);
      res.json(docs);
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // POST upload document
  upload: async (req, res) => {
    try {
      const { lease_id, uploaded_by, replace } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const file_url = `/files/${req.file.filename}`;

      const newDoc = await Document.create({
        lease_id,
        uploaded_by,
        file_url,
        uploaded_at: new Date(),
        replace: replace === true || replace === 'true'
      });

      // If an old file was replaced, delete it from disk
      if (newDoc.replaced_file_url) {
        const oldPath = path.join(__dirname, '../uploads', path.basename(newDoc.replaced_file_url));
        fs.unlink(oldPath, err => {
          if (err && err.code !== 'ENOENT') {
            console.error('File delete error:', err);
          }
        });
      }

      const message = newDoc.replaced_file_url
        ? 'Document reuploaded successfully'
        : 'Document uploaded successfully';

      res.status(201).json({ message, document: newDoc });
    } catch (error) {
      if (error.code === 'DUPLICATE_LEASE') {
        return res.status(409).json({ message: 'Document already uploaded for this lease' });
      }
      console.error('Upload document error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // DELETE document
  delete: async (req, res) => {
    try {
      const affected = await Document.delete(req.params.id);
      if (affected === 0) {
        return res.status(404).json({ message: 'Document not found' });
      }
      res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // PATCH toggle visibility
  toggleVisibility: async (req, res) => {
    try {
      const docId = req.params.id;
      const updated = await Document.toggleVisibility(docId);
      res.status(200).json({ message: 'Visibility toggled', document: updated });
    } catch (error) {
      console.error('Toggle visibility error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = documentController;