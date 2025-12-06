const express=require('express');
const router=express.Router();
const leasePhotoController=require('../controllers/leasePhotoController');
const auth=require('../middlewares/auth');
const multer=require('multer');
const path=require('path'); // 👈 FIX: Import the 'path' module

// Configure multer for file uploads
const upload=multer({dest:path.join(__dirname,'../files')}); // 'path' is now defined

// Upload a new photo for a lease
router.post('/upload/:leaseId',auth,upload.single('file'),leasePhotoController.upload);

// Get all photos (admin use)
router.get('/',auth,leasePhotoController.getAll);

// Get photos by lease
router.get('/:leaseId',auth,leasePhotoController.getByLease);

// Create photo (direct insert via JSON body)
router.post('/',auth,leasePhotoController.create);

// Update visibility (toggle tenant access)
router.patch('/visibility/:photo_id',auth,leasePhotoController.updateVisibility);

// Delete photo
router.delete('/:photo_id',auth,leasePhotoController.delete);

module.exports=router;