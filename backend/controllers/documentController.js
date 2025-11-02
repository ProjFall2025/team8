const Document = require('../models/Document');

const documentController = {
  getByLease: async (req, res) => {
    try {
      const docs = await Document.findByLease(req.params.lease_id);
      res.json(docs);
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  upload: async (req, res) => {
    try {
      const docId = await Document.create(req.body);
      res.status(201).json({ message: 'Document uploaded', document_id: docId });
    } catch (error) {
      console.error('Upload document error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = documentController;