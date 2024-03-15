const express = require("express");
const router = express.Router();
const path = require("path");
const {
  getImages,
  setImages,
  updateImage,
  deleteImage,
} = require("../controllers/imageController");

const { protect } = require("../middleware/authMiddleware");
const { handleDemoReq } = require("../middleware/demoMiddleware");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./uploads/cloud_photo",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
function fileFilter(req, file, cb) {
  //console.log("fileFilter file: ", file);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Type error"));
  }
}

const upload = multer({
  storage,
  fileFilter,
});

router
  .route("/")
  .get(protect, getImages)
  .post(protect, upload.single("image"), setImages);
router
  .route("/:id")
  .put(protect, updateImage)
  .delete(protect, deleteImage);

module.exports = router;
