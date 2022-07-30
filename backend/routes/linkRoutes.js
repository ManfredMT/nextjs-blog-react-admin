const express = require("express");
const router = express.Router();
const {
    getLinks,
    setLinks,
    updateLink,
    deleteLink
} = require('../controllers/linkController')
const {protect}=require('../middleware/authMiddleware')
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.route('/').get(protect, getLinks).post(protect,upload.single('picture'), setLinks)
router.route('/:id').put(protect,upload.single('picture'), updateLink).delete(protect, deleteLink)


module.exports = router;