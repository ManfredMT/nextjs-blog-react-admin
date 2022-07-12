const express = require("express");
const router = express.Router();
const {
  getPosts,
  setPosts,
  updatePost,
  deletePost,
  updateCategory,
  updateTag,
  deleteTag,
  getPostById,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer();

router
  .route("/")
  .get(protect, getPosts)
  .post(protect, upload.single("image"), setPosts);
router.route("/category").put(protect, upload.none(), updateCategory);
router
  .route("/tag")
  .put(protect, upload.none(), updateTag)
  .delete(protect, upload.none(), deleteTag);
router
  .route("/:id")
  .put(protect, upload.single("image"), updatePost)
  .delete(protect, deletePost)
  .get(protect, getPostById);

module.exports = router;
