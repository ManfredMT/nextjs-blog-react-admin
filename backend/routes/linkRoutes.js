const express = require("express");
const router = express.Router();
const path = require("path");
const {
  getLinks,
  setLinks,
  updateLink,
  deleteLink,
} = require("../controllers/linkController");
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
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Image type error"));
  }
}
const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 },
});

router
  .route("/")
  .get(protect, getLinks)
  .post(protect, upload.single("picture"), setLinks);
router
  .route("/:id")
  .put(protect, upload.single("picture"), updateLink)
  .delete(protect, deleteLink);

module.exports = router;
