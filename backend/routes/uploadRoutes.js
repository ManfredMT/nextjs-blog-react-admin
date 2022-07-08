const express = require("express");
const router = express.Router();
const {uploadFile} = require("../controllers/uploadController")

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.route('/').post(upload.single('avatar'),uploadFile)

module.exports = router;