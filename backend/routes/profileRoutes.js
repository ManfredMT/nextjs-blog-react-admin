const express = require("express");
const router = express.Router();
const {
    getProfile,
    updateProfile
} = require('../controllers/profileController')
const {protect}=require('../middleware/authMiddleware')
const multer  = require('multer')
const upload = multer()


router.route('/').get(protect, getProfile)
router.route('/:id').put(protect,upload.single('logo'), updateProfile)


module.exports = router;