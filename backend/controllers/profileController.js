const asyncHandler = require("express-async-handler");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const Profile = require("../models/profileModel");
const Page = require("../models/pageModel");
const Post = require("../models/postModel");

// @desc   Get profile
// @route  GET /api/profile
// @access Private
const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.find({ user: req.user.id });
  res.status(200).json(profile);
});

// @desc   Update profile
// @route  PUT /api/profile/:id
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findById(req.params.id);
  if (!profile) {
    res.status(400);
    throw new Error("Profile not found");
  }
  //const user = await User.findById(req.user.id)
  if (!req.user) {
    res.status(401);
    throw new Error("User not founded");
  }
  if (profile.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  let newProfileData = req.body;
  //console.log('req.files: ',req.files);

  if (req?.files?.logo && req?.files?.logo[0]) {
    newProfileData.logo = "/api/image/" + req.files["logo"][0].filename;
    newProfileData.logoType = req.files["logo"][0].mimetype;
    //console.log("req.files.logo[0]: ",req.files["logo"][0]);
  }
  if (req?.files?.avatar && req?.files?.avatar[0]) {
    newProfileData.avatar = "/api/image/" + req.files["avatar"][0].filename;
    newProfileData.avatarType = req.files["avatar"][0].mimetype;
  }
  if (req?.files?.socialBanner && req?.files?.socialBanner[0]) {
    newProfileData.socialBanner =
      "/api/image/" + req.files["socialBanner"][0].filename;
    //newProfileData.socialBanner = req.files["socialBanner"][0].buffer;
    newProfileData.socialBannerType = req.files["socialBanner"][0].mimetype;
  }

  const revalidateUrl = `http://localhost:${process.env.NEXTJS_PORT}/api/revalidate?secret=${process.env.MY_SECRET_TOKEN}&change=post`;

  try {
    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      newProfileData,
      {
        new: true,
      }
    );

    const pages = ["/", "/tags", "/timeline", "/categories"];
    let categories = [];
    let tags = [];
    const posts = await Post.find({ user: req.user.id, draft: false });

    posts.forEach((doc) => {
      pages.push("/posts/" + doc.title);
    });
    posts.forEach((doc) => {
      if (!categories.includes(doc.category)) {
        pages.push(`/categories/${doc.category}`);
        categories.push(doc.category);
      }
      doc.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          pages.push(`/tags/${tag}`);
          tags.push(tag);
        }
      });
      pages.push(`/posts/${doc.title}`);
    });

    const pageDoc = await Page.findOne({ user: req.user.id });
    const mergePages = [...pages, ...pageDoc.pages];
    const deDupPages = [...new Set(mergePages)];
    await Page.findOneAndUpdate({ user: req.user.id }, { pages: deDupPages });
    console.log("pages: ", deDupPages);

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  } finally {
    await fetch(revalidateUrl);
  }
});

module.exports = {
  getProfile,
  updateProfile,
};
