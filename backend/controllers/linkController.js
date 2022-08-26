const asyncHandler = require("express-async-handler");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const revalidateUrl = `http://localhost:${process.env.NEXTJS_PORT}/api/revalidate?secret=${process.env.MY_SECRET_TOKEN}&change=link`;

const Link = require("../models/linkModel");

// @desc   Get links
// @route  GET /api/links
// @access Private
const getLinks = asyncHandler(async (req, res) => {
  const links = await Link.find({ user: req.user.id });
  res.status(200).json(links);
});

// @desc   Set links
// @route  POST /api/links
// @access Private
const setLinks = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error("Please add a name to the link");
  }
  if (!req.body.website) {
    res.status(400);
    throw new Error("Please add a url");
  } else {
    const linkExists = await Link.findOne({ website: req.body.website });
    if (linkExists) {
      res.status(400);
      throw new Error("友链已存在");
    }
  }

  let linkObj = {
    name: req.body.name,
    website: req.body.website,
    user: req.user.id,
  };
  if (req.body.description) {
    linkObj.description = req.body.description;
  }
  if (req.file) {
    if (
      !(req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/png")
    ) {
      res.status(400);
      throw new Error("Image type error");
    }
    linkObj.picture = "/api/image/" + req.file.filename;
  }
  try {
    const link = await Link.create(linkObj);
    link.picture = undefined;
    res.status(200).json(link);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  } finally {
    await fetch(revalidateUrl);
  }
});

// @desc   Update links
// @route  PUT /api/links/:id
// @access Private
const updateLink = asyncHandler(async (req, res) => {
  const link = await Link.findById(req.params.id);
  if (!link) {
    res.status(400);
    throw new Error("Link not found");
  }
  //const user = await User.findById(req.user.id)
  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }
  if (link.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  let newLinkData = req.body;
  if (req.file) {
    if (
      !(req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/png")
    ) {
      res.status(400);
      throw new Error("Image type error");
    }
    newLinkData.picture = "/api/image/" + req.file.filename;
  }
  try {
    const updatedLink = await Link.findByIdAndUpdate(
      req.params.id,
      newLinkData,
      {
        new: true,
      }
    );
    updatedLink.picture = undefined;
    res.status(200).json(updatedLink);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  } finally {
    await fetch(revalidateUrl);
  }
});

// @desc   Delete links
// @route  DELETE /api/links/:id
// @access Private
const deleteLink = asyncHandler(async (req, res) => {
  const link = await Link.findById(req.params.id);
  if (!link) {
    res.status(400);
    throw new Error("Link not found");
  }

  //const user = await User.findById(req.user.id)

  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }

  if (link.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  try {
    await link.remove();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  } finally {
    await fetch(revalidateUrl);
  }
});

module.exports = {
  getLinks,
  setLinks,
  updateLink,
  deleteLink,
};
