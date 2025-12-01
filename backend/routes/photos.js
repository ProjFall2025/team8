const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const auth = require('../middlewares/auth');

router.get('/', auth, photoController.getAll);
router.get('/user/:user_id', auth, photoController.getByUser);
router.post('/', auth, photoController.upload);
router.delete('/:photo_id', auth, photoController.delete);

module.exports = router;