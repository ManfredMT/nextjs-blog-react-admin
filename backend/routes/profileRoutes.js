const express = require("express");
const router = express.Router();
const path = require("path");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/image");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
function fileFilter(req, file, cb) {
  //console.log("fileFilter file: ", file);
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/svg+xml" ||
    file.mimetype === "image/x-icon" ||
    file.mimetype === "image/vnd.microsoft.icon"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Image type error"));
  }
}
const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 300 * 1024 },
});

router.route("/").get(protect, getProfile);
router.route("/:id").put(
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "socialBanner", maxCount: 1 },
  ]),
  updateProfile
);

module.exports = router;
