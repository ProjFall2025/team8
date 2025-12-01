const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middlewares/auth');
<<<<<<< HEAD
const upload = require('../middlewares/upload'); // ✅ multer config

// GET documents by lease ID (role-aware)
router.get('/:lease_id', auth, documentController.getByLease);

// POST upload document with file
router.post('/upload', auth, upload.single('file'), documentController.upload);

// DELETE document by ID
router.delete('/:id', auth, documentController.delete);

// PATCH toggle tenant visibility
router.patch('/visibility/:id', auth, documentController.toggleVisibility);
=======

router.get('/:lease_id', auth, documentController.getByLease);
router.post('/', auth, documentController.upload);
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0

module.exports = router;