const asyncHandler = require("express-async-handler");
const fs = require("fs");

const Image = require("../models/imageModel");

// @desc   Get images 获取所有图片
// @route  GET /api/images
// @access Private
const getImages = asyncHandler(async (req, res) => {
  const images = await Image.find({ user: req.user.id });
  res.status(200).json(images);
});

// @desc   Set images 上传一张图片
// @route  POST /api/images
// @access Private
const setImages = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error("Please add a title to the image");
  }
  const imageExists = await Image.findOne({ title: req.body.title });
  if (imageExists) {
    res.status(400);
    throw new Error("图片标题已存在");
  }

  let imageObj = {
    title: req.body.title,
    user: req.user.id,
  };
  if (req.body.description) {
    imageObj.description = req.body.description;
  }
  if (req.file) {
    if (!req.file.mimetype.startsWith("image")) {
      res.status(400);
      throw new Error("Type error");
    }
    imageObj.imageUrl = "/api/cloud_photo/" + req.file.filename;
  }
  try {
    const image = await Image.create(imageObj);
    res.status(200).json(image);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc   Update images 修改图片信息
// @route  PUT /api/images/:id
// @access Private
const updateImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image) {
    res.status(400);
    throw new Error("Image not found");
  }
  //const user = await User.findById(req.user.id)
  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }
  if (image.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  let newImageData = req.body;
  try {
    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      newImageData,
      {
        new: true,
      }
    );
    updatedImage.imageUrl = undefined;
    res.status(200).json(updatedImage);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc   Delete images
// @route  DELETE /api/images/:id
// @access Private
const deleteImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image) {
    res.status(400);
    throw new Error("Image not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }

  if (image.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  try {
    const imageUrl = image.imageUrl;
    const path =
      "./uploads/cloud_photo" + imageUrl.substring(imageUrl.lastIndexOf("/"));
    fs.unlinkSync(path);
    await image.remove();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  getImages,
  setImages,
  updateImage,
  deleteImage,
};
