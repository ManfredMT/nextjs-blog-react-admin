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
const { handleDemoReq } = require("../middleware/demoMiddleware");

router
  .route("/")
  .get(protect, getPosts)
  .post(protect, handleDemoReq, upload.single("image"), setPosts);
router
  .route("/category")
  .put(protect, handleDemoReq, upload.none(), updateCategory);
router
  .route("/tag")
  .put(protect, handleDemoReq, upload.none(), updateTag)
  .delete(protect, handleDemoReq, upload.none(), deleteTag);
router
  .route("/:id")
  .put(protect, handleDemoReq, upload.single("image"), updatePost)
  .delete(protect, handleDemoReq, deletePost)
  .get(protect, getPostById);

module.exports = router;
