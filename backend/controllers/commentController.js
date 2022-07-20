const asyncHandler = require("express-async-handler");

const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

// @desc   Get comments by post id
// @route  GET /api/comments/:postId
// @access Public
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId }).select(
    "-email -adminUser"
  ); //with unpublished comments
  res.status(200).json(comments);
});

// @desc   Get all comments
// @route  GET /api/comments/all
// @access Private
const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ adminUser: req.user.id });
  res.status(200).json(comments);
});

// @desc   Set comments
// @route  POST /api/comments
// @access Public
const setComments = asyncHandler(async (req, res) => {
  if (!req.body.postId) {
    res.status(400);
    throw new Error("Please set the postId");
  }
  if (!req.body.username) {
    res.status(400);
    throw new Error("Please add a username");
  }
  if (!req.body.email) {
    res.status(400);
    throw new Error("Please add an email");
  }
  if (!req.body.comment) {
    res.status(400);
    throw new Error("Comment is empty");
  }
  const post = await Post.findById(req.body.postId);

  const userExists = await Comment.findOne({ username: req.body.username });

  if (userExists && userExists.email !== req.body.email) {
    res.status(400);
    throw new Error("User already exists");
  }
  try {
    const comment = await Comment.create({
      adminUser: post.user,
      source: post.title,
      post: req.body.postId,
      username: req.body.username,
      email: req.body.email,
      comment: req.body.comment,
    });
    comment.adminUser = undefined;
    res.status(200).json(comment);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc   Publish/Unpublish comment
// @route  PUT /api/comments/:id
// @access Private
const updateComment = asyncHandler(async (req, res) => {
  if (!req.body.published) {
    res.status(400);
    throw new Error("Please set the value of published");
  }
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(400);
    throw new Error("Comment not found");
  }

  //const user = await User.findById(req.user.id)
  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }

  if (comment.adminUser.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    { published: req.body.published },
    { new: true }
  );
  res.status(200).json(updatedComment);
});

// @desc   Delete comments
// @route  DELETE /api/comments/:id
// @access Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(400);
    throw new Error("Comment not found");
  }

  //const user = await User.findById(req.user.id)

  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }

  if (comment.adminUser.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await comment.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getComments,
  getAllComments,
  setComments,
  updateComment,
  deleteComment,
};
