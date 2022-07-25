const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer();

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
