const express = require("express");
const router = express.Router();
const {
  getComments,
  getAllComments,
  setComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

router.route("/all").get(protect, getAllComments);
router.route("/").post(setComments);
router.route("/:postId").get(getComments);
router.route("/:id").put(protect, updateComment).delete(protect, deleteComment);

module.exports = router;
